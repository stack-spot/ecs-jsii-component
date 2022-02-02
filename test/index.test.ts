import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster } from 'aws-cdk-lib/aws-ecs';
import { ContainerEnvComponent } from '../lib/index';

describe('ContainerEnvComponent', () => {
  test('has cluster property', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const subnets = vpc.selectSubnets({
      onePerAz: true,
      subnetType: SubnetType.PUBLIC,
    });
    const environment = new ContainerEnvComponent(stack, 'TestConstruct', {
      subnets,
      vpc,
    });

    expect(environment.cluster).toBeInstanceOf(Cluster);
  });

  test('has only one VPC', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const subnets = vpc.selectSubnets({
      onePerAz: true,
      subnetType: SubnetType.PUBLIC,
    });
    new ContainerEnvComponent(stack, 'TestConstruct', {
      subnets,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::VPC', 1);
  });

  test('has default cluster name', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const subnets = vpc.selectSubnets({
      onePerAz: true,
      subnetType: SubnetType.PUBLIC,
    });
    new ContainerEnvComponent(stack, 'TestConstruct', {
      subnets,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::Cluster', {
      ClusterName: 'ContainerEnvComponentCluster',
    });
  });

  test('has the option to change the cluster name', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const subnets = vpc.selectSubnets({
      onePerAz: true,
      subnetType: SubnetType.PUBLIC,
    });
    new ContainerEnvComponent(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      subnets,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::Cluster', {
      ClusterName: 'TestCluster',
    });
  });

  test('has container insights enabled by default', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const subnets = vpc.selectSubnets({
      onePerAz: true,
      subnetType: SubnetType.PUBLIC,
    });
    new ContainerEnvComponent(stack, 'TestConstruct', {
      subnets,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::Cluster', {
      ClusterSettings: [
        {
          Name: 'containerInsights',
          Value: 'enabled',
        },
      ],
    });
  });

  test('has the option to enable container insights', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const subnets = vpc.selectSubnets({
      onePerAz: true,
      subnetType: SubnetType.PUBLIC,
    });
    new ContainerEnvComponent(stack, 'TestConstruct', {
      containerInsights: true,
      subnets,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::Cluster', {
      ClusterSettings: [
        {
          Name: 'containerInsights',
          Value: 'enabled',
        },
      ],
    });
  });

  test('has the option to disable container insights', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const subnets = vpc.selectSubnets({
      onePerAz: true,
      subnetType: SubnetType.PUBLIC,
    });
    new ContainerEnvComponent(stack, 'TestConstruct', {
      containerInsights: false,
      subnets,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::Cluster', {
      ClusterSettings: [
        {
          Name: 'containerInsights',
          Value: 'disabled',
        },
      ],
    });
  });

  test('reuses the VPC in the cluster', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const subnets = vpc.selectSubnets({
      onePerAz: true,
      subnetType: SubnetType.PUBLIC,
    });
    const environment = new ContainerEnvComponent(stack, 'TestConstruct', {
      subnets,
      vpc,
    });

    expect(environment.cluster.vpc).toBe(vpc);
  });
});
