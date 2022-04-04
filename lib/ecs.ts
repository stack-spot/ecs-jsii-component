import { Stack } from 'aws-cdk-lib';
import { IVpc, SubnetType } from 'aws-cdk-lib/aws-ec2';
import {
  Cluster,
  Compatibility,
  ContainerImage,
  ICluster,
  Protocol,
  TaskDefinition,
} from 'aws-cdk-lib/aws-ecs';
import {
  EcsFargateLaunchTarget,
  EcsRunTask,
} from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
import { StackManager } from '@stackspot/cdk-core';

/**
 * Ecs construct props.
 */
export interface EcsCreateProps {
  /**
   * The name for the cluster.
   */
  readonly clusterName: string;

  /**
   * If true CloudWatch Container Insights will be enabled for the cluster.
   *
   * @default false
   */
  readonly containerInsights?: boolean;

  /**
   * The VPC to be used.
   */
  readonly vpc: IVpc;
}

/**
 * Task definition construct props.
 */
export interface TaskDefinitionCreateProps {
  /**
   * The container image to deploy.
   */
  readonly containerImage: string;

  /**
   * The name of the container within the cluster.
   */
  readonly containerName: string;

  /**
   * The container port.
   */
  readonly containerPort: number;

  /**
   * The amount of CPU to use.
   */
  readonly cpu: string;

  /**
   * The host port.
   */
  readonly hostPort: number;

  /**
   * The amount of memory in MiB to use.
   */
  readonly memoryMiB: string;

  /**
   * Represents whether the cluster will have public IP.
   */
  readonly publicIp: boolean;

  /**
   * The type of subnet to use.
   */
  readonly subnetType: SubnetType;

  /**
   * The VPC to use.
   */
  readonly vpc: IVpc;
}

/**
 * Component for managing an ECS cluster.
 */
export class Ecs extends Construct {
  /**
   * Cluster that will be created.
   */
  public readonly cluster: Cluster;

  /**
   * Creates a new instance of class Ecs.
   *
   * @param {Construct} scope The construct within which this construct is defined.
   * @param {string} id Identifier to be used in AWS CloudFormation.
   * @param {EcsCreateProps} [props={}] Parameters of the class Ecs.
   * @see {@link https://docs.aws.amazon.com/cdk/v2/guide/constructs.html#constructs_init|AWS CDK Constructs}
   */
  constructor(scope: Construct, id: string, props: EcsCreateProps) {
    super(scope, id);

    this.cluster = new Cluster(this, `cluster-${props.clusterName}`, {
      clusterName: props.clusterName,
      containerInsights:
        typeof props.containerInsights === 'boolean'
          ? props.containerInsights
          : false,
      vpc: props.vpc,
    });

    StackManager.saveResource(this, {
      arn: this.cluster.clusterArn,
      name: props.clusterName,
      stackName: Stack.of(scope).stackName,
    });
  }

  /**
   * Generic function to add task definition.
   *
   * @param {Construct} scope The construct within which this construct is defined.
   * @param {Cluster} cluster The cluster to use.
   * @param {TaskDefinitionCreateProps} props Task definition construct props.
   * @returns {EcsRunTask} The task to run.
   */
  private static addTaskDefinitionGeneric(
    scope: Construct,
    cluster: ICluster,
    props: TaskDefinitionCreateProps
  ): EcsRunTask {
    const taskDefinition = new TaskDefinition(
      scope,
      `taskdefinition-${props.containerName}`,
      {
        compatibility: Compatibility.FARGATE,
        cpu: props.cpu,
        memoryMiB: props.memoryMiB,
      }
    );

    const containerDefinition = taskDefinition.addContainer(
      `container-${props.containerName}`,
      {
        image: ContainerImage.fromRegistry(props.containerImage),
        containerName: props.containerName,
      }
    );

    containerDefinition.addPortMappings({
      containerPort: props.containerPort,
      hostPort: props.hostPort,
      protocol: Protocol.TCP,
    });

    return new EcsRunTask(scope, `runtaskdefinition-${props.containerName}`, {
      cluster,
      launchTarget: new EcsFargateLaunchTarget(),
      taskDefinition,
      assignPublicIp: props.publicIp,
      subnets: { subnetType: props.subnetType },
    });
  }

  /**
   * Add a task definition to the AWS ECS cluster.
   *
   * @param {Construct} scope The construct within which this construct is defined.
   * @param {TaskDefinitionCreateProps} props Task definition construct props.
   * @returns {EcsRunTask} The task to run.
   */
  public addTaskDefinition(
    scope: Construct,
    props: TaskDefinitionCreateProps
  ): EcsRunTask {
    return Ecs.addTaskDefinitionGeneric(scope, this.cluster, props);
  }

  /**
   * Add a task definition to the AWS ECS cluster from the cluster name.
   *
   * @param {Construct} scope The construct within which this construct is defined.
   * @param {string} clusterName The name of the cluster.
   * @param {TaskDefinitionCreateProps} props Task definition construct props.
   * @returns {EcsRunTask} The task to run.
   */
  public static addTaskDefinitionFromStackEcs(
    scope: Construct,
    clusterName: string,
    props: TaskDefinitionCreateProps
  ): EcsRunTask {
    const cluster = Cluster.fromClusterAttributes(scope, 'GetCluster', {
      clusterName,
      vpc: props.vpc,
      securityGroups: [],
    });

    return Ecs.addTaskDefinitionGeneric(scope, cluster, props);
  }
}
