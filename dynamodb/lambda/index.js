const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
	  const params = {
		      TableName: 'fortunes'
		    };

	  try {
		      await dynamodb.deleteTable(params).promise();
		      console.log('Table deleted successfully');
		   } catch (error) {
			        console.error('Error deleting table:', error);
		  }
};

