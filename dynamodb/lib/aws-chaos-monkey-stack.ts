import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as path from 'path';
import { Construct } from 'constructs';


export class AwsChaosMonkeyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // Create a Lambda function
    const chaosMonkeyFunction= new lambda.Function(this, 'ChaosMonkeyFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '/../lambda')),
      functionName: 'chaos-monkey',
    });
    
    // Grant the Lambda function permissions to delete the DynamoDB table
    const tableArn = `arn:aws:dynamodb:${this.region}:${this.account}:table/fortunes`;
    chaosMonkeyFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:DeleteTable'],
      resources: [tableArn],
    }));

    // Create an EventBridge rule to trigger the Lambda function every day at midnight UTC
    const rule = new events.Rule(this, 'ChaosMonkeyRule', {
      schedule: events.Schedule.expression('cron(0 0 * * ? *)'), // Daily at midnight UTC
    });

    // Add the Lambda function as the target of the rule
    rule.addTarget(new targets.LambdaFunction(chaosMonkeyFunction));

    
  }
}
