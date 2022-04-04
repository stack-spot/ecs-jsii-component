import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster } from 'aws-cdk-lib/aws-ecs';
import { Ecs } from '../lib/index';

describe('Ecs', () => {
  test('creates a cluster', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      vpc: new Vpc(stack, 'TestVpc'),
    });
    const template = Template.fromStack(stack);

    template.hasResource('AWS::ECS::Cluster', {});
  });

  test('creates only one cluster', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      vpc: new Vpc(stack, 'TestVpc'),
    });
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::ECS::Cluster', 1);
  });

  test('creates a cluster property', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const ecs = new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      vpc: new Vpc(stack, 'TestVpc'),
    });

    expect(ecs.cluster).toBeInstanceOf(Cluster);
  });

  test('creates a cluster with right name', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      vpc: new Vpc(stack, 'TestVpc'),
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::Cluster', {
      ClusterName: 'TestCluster',
    });
  });

  test('creates a cluster with container insights enabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      containerInsights: true,
      vpc: new Vpc(stack, 'TestVpc'),
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::Cluster', {
      ClusterSettings: [{ Name: 'containerInsights', Value: 'enabled' }],
    });
  });

  test('creates a cluster with container insights disabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      containerInsights: false,
      vpc: new Vpc(stack, 'TestVpc'),
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::Cluster', {
      ClusterSettings: [{ Name: 'containerInsights', Value: 'disabled' }],
    });
  });

  test('creates a cluster with container insights disabled as default', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      vpc: new Vpc(stack, 'TestVpc'),
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::Cluster', {
      ClusterSettings: [{ Name: 'containerInsights', Value: 'disabled' }],
    });
  });

  test('use only one vpc', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      vpc: new Vpc(stack, 'TestVpc'),
    });
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::VPC', 1);
  });

  test('save cluster arn with stack manager', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      vpc: new Vpc(stack, 'TestVpc'),
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Name: '/stackspot/TestStack/TestCluster',
      Type: 'String',
    });
  });

  test('can add a task definition in cluster', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const ecs = new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      vpc,
    });
    ecs.addTaskDefinition(stack, {
      containerImage: 'amazon/amazon-ecs-sample',
      containerName: 'TestContainer',
      containerPort: 80,
      cpu: '256',
      hostPort: 80,
      memoryMiB: '512',
      publicIp: false,
      subnetType: SubnetType.PUBLIC,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.hasResource('AWS::ECS::TaskDefinition', {});
    template.resourceCountIs('AWS::ECS::TaskDefinition', 1);
  });

  test('can add a task definition with fargate compatibility in cluster', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const ecs = new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      vpc,
    });
    ecs.addTaskDefinition(stack, {
      containerImage: 'amazon/amazon-ecs-sample',
      containerName: 'TestContainer',
      containerPort: 80,
      cpu: '256',
      hostPort: 80,
      memoryMiB: '512',
      publicIp: false,
      subnetType: SubnetType.PUBLIC,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::TaskDefinition', {
      RequiresCompatibilities: ['FARGATE'],
    });
  });

  test('can add a task definition with right cpu value in cluster', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const ecs = new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      vpc,
    });
    ecs.addTaskDefinition(stack, {
      containerImage: 'amazon/amazon-ecs-sample',
      containerName: 'TestContainer',
      containerPort: 80,
      cpu: '256',
      hostPort: 80,
      memoryMiB: '512',
      publicIp: false,
      subnetType: SubnetType.PUBLIC,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::TaskDefinition', { Cpu: '256' });
  });

  test('can add a task definition with right memory value in cluster', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const ecs = new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      vpc,
    });
    ecs.addTaskDefinition(stack, {
      containerImage: 'amazon/amazon-ecs-sample',
      containerName: 'TestContainer',
      containerPort: 80,
      cpu: '256',
      hostPort: 80,
      memoryMiB: '512',
      publicIp: false,
      subnetType: SubnetType.PUBLIC,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::TaskDefinition', {
      Memory: '512',
    });
  });

  test('can add a task definition with right container image in cluster', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const ecs = new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      vpc,
    });
    ecs.addTaskDefinition(stack, {
      containerImage: 'amazon/amazon-ecs-sample',
      containerName: 'TestContainer',
      containerPort: 80,
      cpu: '256',
      hostPort: 80,
      memoryMiB: '512',
      publicIp: false,
      subnetType: SubnetType.PUBLIC,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [{ Image: 'amazon/amazon-ecs-sample' }],
    });
  });

  test('can add a task definition with right container name in cluster', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const ecs = new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      vpc,
    });
    ecs.addTaskDefinition(stack, {
      containerImage: 'amazon/amazon-ecs-sample',
      containerName: 'TestContainer',
      containerPort: 80,
      cpu: '256',
      hostPort: 80,
      memoryMiB: '512',
      publicIp: false,
      subnetType: SubnetType.PUBLIC,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [{ Name: 'TestContainer' }],
    });
  });

  test('can add a task definition with right ports in cluster', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const ecs = new Ecs(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      vpc,
    });
    ecs.addTaskDefinition(stack, {
      containerImage: 'amazon/amazon-ecs-sample',
      containerName: 'TestContainer',
      containerPort: 80,
      cpu: '256',
      hostPort: 80,
      memoryMiB: '512',
      publicIp: false,
      subnetType: SubnetType.PUBLIC,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          PortMappings: [{ ContainerPort: 80, HostPort: 80, Protocol: 'tcp' }],
        },
      ],
    });
  });

  test('can add a task definition with fargate compatibility in cluster from stack', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    Ecs.addTaskDefinitionFromStackEcs(stack, 'TestCluster', {
      containerImage: 'amazon/amazon-ecs-sample',
      containerName: 'TestContainer',
      containerPort: 80,
      cpu: '256',
      hostPort: 80,
      memoryMiB: '512',
      publicIp: false,
      subnetType: SubnetType.PUBLIC,
      vpc: new Vpc(stack, 'TestVpc'),
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::TaskDefinition', {
      RequiresCompatibilities: ['FARGATE'],
    });
  });

  test('can add a task definition with right cpu value in cluster from stack', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    Ecs.addTaskDefinitionFromStackEcs(stack, 'TestCluster', {
      containerImage: 'amazon/amazon-ecs-sample',
      containerName: 'TestContainer',
      containerPort: 80,
      cpu: '256',
      hostPort: 80,
      memoryMiB: '512',
      publicIp: false,
      subnetType: SubnetType.PUBLIC,
      vpc: new Vpc(stack, 'TestVpc'),
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::TaskDefinition', {
      Cpu: '256',
    });
  });

  test('can add a task definition with right memory value in cluster from stack', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    Ecs.addTaskDefinitionFromStackEcs(stack, 'TestCluster', {
      containerImage: 'amazon/amazon-ecs-sample',
      containerName: 'TestContainer',
      containerPort: 80,
      cpu: '256',
      hostPort: 80,
      memoryMiB: '512',
      publicIp: false,
      subnetType: SubnetType.PUBLIC,
      vpc: new Vpc(stack, 'TestVpc'),
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::TaskDefinition', {
      Memory: '512',
    });
  });

  test('can add a task definition with right container image in cluster from stack', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    Ecs.addTaskDefinitionFromStackEcs(stack, 'TestCluster', {
      containerImage: 'amazon/amazon-ecs-sample',
      containerName: 'TestContainer',
      containerPort: 80,
      cpu: '256',
      hostPort: 80,
      memoryMiB: '512',
      publicIp: false,
      subnetType: SubnetType.PUBLIC,
      vpc: new Vpc(stack, 'TestVpc'),
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [{ Image: 'amazon/amazon-ecs-sample' }],
    });
  });

  test('can add a task definition with right container name in cluster from stack', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    Ecs.addTaskDefinitionFromStackEcs(stack, 'TestCluster', {
      containerImage: 'amazon/amazon-ecs-sample',
      containerName: 'TestContainer',
      containerPort: 80,
      cpu: '256',
      hostPort: 80,
      memoryMiB: '512',
      publicIp: false,
      subnetType: SubnetType.PUBLIC,
      vpc: new Vpc(stack, 'TestVpc'),
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [{ Name: 'TestContainer' }],
    });
  });

  test('can add a task definition with right ports in cluster from stack', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    Ecs.addTaskDefinitionFromStackEcs(stack, 'TestCluster', {
      containerImage: 'amazon/amazon-ecs-sample',
      containerName: 'TestContainer',
      containerPort: 80,
      cpu: '256',
      hostPort: 80,
      memoryMiB: '512',
      publicIp: false,
      subnetType: SubnetType.PUBLIC,
      vpc: new Vpc(stack, 'TestVpc'),
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          PortMappings: [{ ContainerPort: 80, HostPort: 80, Protocol: 'tcp' }],
        },
      ],
    });
  });
});
