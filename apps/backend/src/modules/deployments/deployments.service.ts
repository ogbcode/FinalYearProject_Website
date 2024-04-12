import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Deployment } from './entities/deployment.entity';
import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';

@Injectable()
export class DeploymentsService {
  private readonly graphqlEndpoint = process.env.RAILWAY_GRAPHQL;
  private readonly projectId = process.env.PROJECTID;
  private readonly apiToken = process.env.RAILWAY_TOKEN;

  constructor(
    @InjectRepository(Deployment)
    private readonly deployRepository: Repository<Deployment>,
  ) {}

  async create(createDeploymentDto: CreateDeploymentDto, bot: any): Promise<any> {
    try {
      const deployedBot = await this.deploy(createDeploymentDto.name,createDeploymentDto.userId, createDeploymentDto.botId);
      const deployProps = {
        ...createDeploymentDto,
        bot: bot,
        projectId: this.projectId,
        serviceId: deployedBot.serviceId,
        environmentId: deployedBot.environmentId,
        domain: deployedBot.domain,
      };
      const newDeployment = this.deployRepository.create(deployProps);
      const savedDeployment = await this.deployRepository.save(newDeployment);
      return savedDeployment;
    } catch (error) {
      console.error('Error creating deployment:', error);
      throw new InternalServerErrorException('Failed to create deployment');
    }
  }

  async executeGraphql(query: string): Promise<any> {
    try {
      const headers = {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.post(this.graphqlEndpoint, JSON.stringify({ query }), { headers });
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Response Text:", error);
      throw new InternalServerErrorException('Failed to execute GraphQL query');
    }
  }
  

  async createService(projectId: string, repo: string, branch: string, serviceName: string): Promise<any> {
    const mutation = `
      mutation serviceCreate {
        serviceCreate(
          input: {
            projectId: "${projectId}"
            source: { repo: "${repo}" }
            branch: "${branch}"
            name: "${serviceName}" 
          }
        ) {
          name
          projectId
          id
          serviceInstances {
            edges {
              node {
                environmentId
              }
            }
          }
        }
      }
    `;
    return await this.executeGraphql(mutation);
  }

  async redeploy( serviceId: string,environmentId: string,): Promise<string> {
    const mutation = `
      mutation MyMutation {
        serviceInstanceRedeploy(serviceId: "${serviceId}",environmentId: "${environmentId}")
      }
    `;
    return await this.executeGraphql(mutation);
  }

  async upsertVariable(projectId: string, environmentId: string, serviceId: string, variableName: string, variableValue: string): Promise<any> {
    const mutation = `
      mutation variableUpsert {
        variableUpsert(
          input: {
            projectId: "${projectId}"
            environmentId: "${environmentId}"
            serviceId: "${serviceId}"
            name: "${variableName}"
            value: "${variableValue}"
          }
        )
      }
    `;
    return await this.executeGraphql(mutation);
  }
  async findOne(id: string): Promise<Deployment> {
    const bot = await this.deployRepository.findOne({ where: { id } });
    if (!bot) {
      throw new NotFoundException(`Deployment with ID ${id} not found`);
    }
    return bot;
  }


  async generateDomain(environmentId: string, serviceId: string): Promise<any> {
    const mutation = `
      mutation serviceDomainCreate {
        serviceDomainCreate(input: {environmentId: "${environmentId}", serviceId: "${serviceId}"}) {
          id
          domain
          createdAt
        }
      }
    `;
    return await this.executeGraphql(mutation);
  }

  async deleteService(serviceId: string): Promise<any> {
    const mutation = `
      mutation serviceDelete {
        serviceDelete(id: "${serviceId}")
      }
    `;

    return await this.executeGraphql(mutation);
  }
  async delete(id:string,serviceId:string):Promise<any>{
    try{
    await this.deployRepository.delete(id)
    await this.deleteService(serviceId)
    return {message:"Bot succesfully deleted"}
    }
    catch(error){
      return{message:"Failed to delete bot"}
    }
  }

  async deploy(serviceName: string,userId: string, botId: string): Promise<any> {
    try {
      const deployment = await this.createService(this.projectId, "ogbcode/FinalYearProject_Bot", "master", serviceName);
      const serviceId = deployment?.data?.serviceCreate?.id;
      const environmentId = deployment?.data?.serviceCreate?.serviceInstances?.edges?.[0]?.node?.environmentId;

      if (!serviceId || !environmentId) {
        throw new Error('Deployment data is incomplete.');
      }
      const key="YourSecretKeyYourSecretKey123456"
      const serviceDomain = await this.generateDomain(environmentId, serviceId);
      const domain = serviceDomain?.data?.serviceDomainCreate?.domain;

      if (!domain) {
        throw new Error('Failed to generate service domain.');
      }

      await this.upsertVariable(this.projectId, environmentId, serviceId, "botId", botId);
      await this.upsertVariable(this.projectId, environmentId, serviceId, "userId", userId);
      await this.upsertVariable(this.projectId, environmentId, serviceId, "domain", domain);
      await this.upsertVariable(this.projectId, environmentId, serviceId, "ENCRYPTION_KEY", key);
      await this.upsertVariable(this.projectId, environmentId, serviceId, "PGDATABASE", "${{fianalyear DB.PGDATABASE}}");
      await this.upsertVariable(this.projectId, environmentId, serviceId, "PGHOST", "${{fianalyear DB.PGHOST}}");
      await this.upsertVariable(this.projectId, environmentId, serviceId, "PGPASSWORD", "${{fianalyear DB.PGPASSWORD}}");
      await this.upsertVariable(this.projectId, environmentId, serviceId, "PGPORT", "${{fianalyear DB.PGPORT}}");
      await this.upsertVariable(this.projectId, environmentId, serviceId, "PGUSER", "${{fianalyear DB.PGUSER}}");
      return {
        message: "Deploy Successful",
        environmentId: environmentId,
        serviceId: serviceId,
        domain: domain,
      };
    } catch (error) {
      console.error('Deployment Error:', error);
      return { message: "Deploy failed" };
    }
  }
}
