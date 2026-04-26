import * as path from 'path';
const distPath = path.join(__dirname, '..', '..', 'dist');
// console.log('DIST PATH = ', distPath);

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // Use L1 (CloudFormation-level) constructs in AWS CDK 
    // to gain a deeper understanding of 
    // how the underlying resources are defined and work, 
    // keeping everything explicit and transparent.

    // 1. S3 bucket (private)
    const bucket = new s3.Bucket(this, 'SpaBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // 2. OAC
    const oac = new cloudfront.S3OriginAccessControl(this, 'SpaOAC', {
      signing: cloudfront.Signing.SIGV4_ALWAYS,
    });

    // 3. CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'SpaDistribution', {
      defaultRootObject: 'index.html',

      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket, {
          originAccessControl: oac,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },

      // SPA fallback
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // 4. Bucket policy (CloudFront -> S3)
// NOTE: Explicit S3 bucket policy is intentionally disabled.
// CloudFront access to S3 (s3:GetObject) is already automatically managed by CDK
// when using Origin Access Control (OAC) via `S3BucketOrigin.withOriginAccessControl(...)`.
//
// Keeping this block as a reference for visibility of what CDK generates implicitly,
// but removing it to avoid duplicate policy statements in the synthesized template.
//
// bucket.addToResourcePolicy(
//   new iam.PolicyStatement({
//     sid: 'AllowCloudFrontRead',
//     effect: iam.Effect.ALLOW,
//     principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
//     actions: ['s3:GetObject'],
//     resources: [bucket.arnForObjects('*')],
//     conditions: {
//       StringEquals: {
//         'AWS:SourceArn': distribution.distributionArn,
//       },
//     },
//   })
// );

    // 5. Deploy + invalidation
    new s3deploy.BucketDeployment(this, 'DeploySpa', {
      sources: [
        s3deploy.Source.asset(distPath)
      ],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // 6. Outputs
    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: `https://${distribution.distributionDomainName}`,
    });

    new cdk.CfnOutput(this, 'S3BucketName', {
      value: bucket.bucketName,
    });
  }
}
