import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsChaosMonkeyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // Create a Lambda function
    const chaosMonkeyFunction= new lambda.Function(this, 'ChaosMonkeyFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '/../lambda')),
    });

    // Grant the Lambda function permissions to delete the DynamoDB table
    const tableArn = `arn:aws:dynamodb:${this.region}:${this.account}:table/fortunes`;
    chaosMonkeyFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:DeleteTable'],
      resources: [tableArn],
    }));


  }
}
