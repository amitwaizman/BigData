# BigData

In this project we will design a system that feeds on large-scale commercial transactions, stores them and enables NRT status monitoring, investigation and search and pattern recognition using machine learning.

### Purpose:
Design and implementation of a big data analytics system harnessing NoSQL database infrastructures, tools from Ecosystem Hadoop
and a guided concept of services (local and cloud-based) using a typical architectural template for a hybrid cloud computing environment.

• The system will receive pizza order transactions from a chain with dozens of branches.<br />
• The system will receive a message about the opening and closing of a branch.<br />
• Order transaction data shall include at least the following data.<br />
• The system will display the following up-to-date data via a dashboard.<br />
• The system will allow a search in order data for the branch on a certain date.<br />
• The system will allow finding relationship rules between the types of additions from date range data.<br />

#### The simulator
Pizza order producer processing, including order time, at which branch and what toppings were requested. After a random time interval the simulator will report that the order is complete.

#### Kafka server (in the cloud)
  Will receive messages and distribute them to the Search Elastic search engine (in a Docker container) to the establishment MongoDB data (in the cloud)

#### js.Node based server (local)
  Will use the following databases:<br />
o MongoDB (in the cloud) retrieving data for the purpose of training a relational model using a cloud service.<br />
  BigML,AWS or any other suitable service.<br />
o Elasticsearch (in a Docker container) searching order data in a date range.<br />
o Redis (in a Docker container) saving the status of central data as of this moment and displayed in the dashboard.<br />

#### Redis
Saves the status of all the data displayed on the dashboard and updates using the WS protocol.

#### js.Node based server (local)
  Will use com.Bigml services to build an association model.
  
  
  ![image](https://user-images.githubusercontent.com/93525881/226264941-3dab1793-f32a-4210-8516-1d24d16e179c.png)
  
  ![image](https://user-images.githubusercontent.com/93525881/226265003-59ac3df7-8e15-4bba-8af1-ee7767079eef.png)

