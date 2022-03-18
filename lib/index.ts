import { Construct } from 'constructs';
import {
  IVpc,
  SubnetSelection,
  SubnetType,
} from 'aws-cdk-lib/aws-ec2';
import { StackManager } from '@stackspot/cdk-core';
import {
  Cluster,
  Compatibility,
  ContainerImage,
  Protocol,
  TaskDefinition,
} from 'aws-cdk-lib/aws-ecs';
import {
  EcsFargateLaunchTarget,
  EcsRunTask,
} from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Stack } from 'aws-cdk-lib';

export interface EcsCreateProps {
  readonly clusterName: string;
  readonly containerInsights?: boolean;
  readonly subnets: SubnetSelection;
  readonly vpc: IVpc;
  /** @default PRIVATE_ISOLATED */
  readonly subnetType?: SubnetType;
}

export interface TaskDefinitionCreateProps {
  readonly vpc: IVpc;
  /** @default PRIVATE_ISOLATED */
  readonly subnetType?: SubnetType;
  readonly containerName: string;
  readonly containerImage: string;
  /** @default 256 */
  readonly cpu?: string;
  /** @default 512 */
  readonly memoryMiB?: string;
  /** @default 80 */
  readonly containerPort: number;
  /** @default 80 */
  readonly hostPort: number;
  /** @default false */
  readonly publicIp?: boolean;
}

export class EcsCreate extends Construct {
  /**
   * Cluster that will be created.
   */
  public readonly cluster: Cluster;

  /**
   * EcsCreate creates a Ecs environment to use in some
   * application.
   */
  constructor(scope: Construct, id: string, props: EcsCreateProps) {
    super(scope, id);
    let containerInsights: boolean | undefined = true;
    if ((typeof props.containerInsights) === 'boolean') {
      containerInsights = props.containerInsights;
    }
    this.cluster = new Cluster(this, 'cluster-'.concat(props.clusterName), {
      clusterName: props.clusterName,
      containerInsights,
      vpc: props.vpc,
    });
    StackManager.saveResource(
      this,
      {
        arn: this.cluster.clusterArn,
        name: props.clusterName,
        stackName: Stack.of(scope).stackName,

      },
    );
  }

  public addTaskDefinition(
    scope: Construct,
    props: TaskDefinitionCreateProps,
  ) {
    const taskDefinition = new TaskDefinition(
      this,
      'taskdefinition-'.concat(props.containerName),
      {
        compatibility: Compatibility.FARGATE,
        cpu: props.cpu,
        memoryMiB: props.memoryMiB,
      },
    );
    const containerDefinition = taskDefinition.addContainer(
      'container-'.concat(props.containerName),
      {
        image: ContainerImage.fromRegistry(props.containerImage),
        containerName: props.containerName,
      },
    );

    containerDefinition.addPortMappings({
      containerPort: props.containerPort,
      hostPort: props.hostPort,
      protocol: Protocol.TCP,
    });

    new EcsRunTask(scope, 'runtaskdefinition-'.concat(props.containerName), {
      cluster: this.cluster,
      launchTarget: new EcsFargateLaunchTarget(),
      taskDefinition,
      assignPublicIp: props.publicIp,
      subnets: {
        subnetType: props.subnetType,
      },
    });
  }

  public static addTaskDefinitionFromStackECS(
    scope: Construct,
    clusterName: string,
    props: TaskDefinitionCreateProps,
  ) {
    const taskDefinition = new TaskDefinition(
      scope,
      'taskdefinition-'.concat(props.containerName),
      {
        compatibility: Compatibility.FARGATE,
        cpu: props.cpu,
        memoryMiB: props.memoryMiB,
      },
    );
    const containerDefinition = taskDefinition.addContainer(
      'container-'.concat(props.containerName),
      {
        image: ContainerImage.fromRegistry(props.containerImage),
        containerName: props.containerName,
      },
    );

    containerDefinition.addPortMappings({
      containerPort: props.containerPort,
      hostPort: props.hostPort,
      protocol: Protocol.TCP,
    });

    new EcsRunTask(scope, 'runtaskdefinition-'.concat(props.containerName), {
      cluster: Cluster.fromClusterAttributes(scope, 'GetCluster', {
        clusterName,
        vpc: props.vpc,
        securityGroups: [],
      }),
      launchTarget: new EcsFargateLaunchTarget(),
      taskDefinition,
      assignPublicIp: props.publicIp,
      subnets: {
        subnetType: props.subnetType,
      },
    });
  }
}
