import {
  IVpc,
  SubnetSelection,
} from 'aws-cdk-lib/aws-ec2';
import {
  Cluster,
} from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';

/**
 * Configuration for container env component.
 */
export interface ContainerEnvComponentProps {
  /**
   * The name for the cluster.
   *
   * @default ContainerEnvComponentCluster
   */
  readonly clusterName?: string;

  /**
   * If true CloudWatch Container Insights will be enabled for the cluster.
   *
   * @default true
   */
  readonly containerInsights?: boolean;

  /**
   * The subnets to be used.
   */
  readonly subnets: SubnetSelection;

  /**
   * The VPC to be used.
   */
  readonly vpc: IVpc;
}

/**
 * Define a container environment.
 *
 * See the documentation for more details.
 */
export class ContainerEnvComponent extends Construct {
  /**
   * Cluster that will be created.
   */
  public readonly cluster: Cluster;

  /**
   * ContainerEnvComponent creates a container environment to use in some
   * application.
   */
  constructor(scope: Construct, id: string, props: ContainerEnvComponentProps) {
    super(scope, id);

    let containerInsights: boolean | undefined = true;

    if ((typeof props.containerInsights) === 'boolean') {
      containerInsights = props.containerInsights;
    }

    this.cluster = new Cluster(this, 'ContainerEnvComponentCluster', {
      clusterName: props.clusterName || 'ContainerEnvComponentCluster',
      containerInsights,
      vpc: props.vpc,
    });
  }
}
