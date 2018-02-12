# The postwoman always rings twice
#### *by Eneko Bikandi*
In this codebase there is an approach to the Postwoman problem (explained in the *Exercise.md* file). 

There are three point in this file:

- **Disclaimer**. Some thoughts.
- **Approach**. To explain the approach taken and its logic.
- **How to Run**. A little guide to run the app.


##Disclaimer
The approach taken has been very limited by the time I have had, so I preffer having this disclaimer to explain myself. Sadly, work and studies have requested the most of my time and I have not been able to make or research some improvements that could be interesting:

* I have chosen Typescript as the coding language, even though Java would be better as it is part of Stubhub main stack. This decision has been taken because I felt that I could write better code in less time basicallly, and because I **enjoy** coding in JavaScript. Also, the typing and modularization of Typescript brings a good option to write it in OOP way.
* The main complexity comes when we see that the modules talk with each other using events. Maybe this could be hanlded more "elegantly" using some library for managing the app state, like Redux. but as it is requested not to use frameworks and focus on the code, I wanted to stay in a lower level and manage all "by hand".
* JavaScript Promises could be a good option to handle asynchronous behavior instead of sending events. Anyway, due to the lack of time, this has not been researched.
* More unit test should be written. Anyway, due to the lack of time, I've written some basic ones. Also there are a couple of tests that need to be improved.
* As Bitbucket offers, it would be nice to set a CI pipeline for the project builds, for example, to run the tests after each merge. However, this would need asking for access to the repo administrator and I have preferred to invest the few time I had in the code.
* Lots of improving TODOs left in the code.

##Approach
This approach is composed by four main modules:

* Parcel.
* ParcelQueueManager.
* PostWoman.
* StandardInputCarrier.

Anyway, the main entry point to the app is the index.ts file, which start StandardInputCarrier to check the stdin.

###Parcel
It is a class that represents the objects we want to send to the employees. Is is simple class that encapsulates the values we need for each parcel (*code*, *employee* and *premium*) and the logic to send and retry. Note that we do not check if the code is unique, as there is no limitation telling it to us in the exercise, so **we do not check if two different parcels have different codes**

It gets an *EventEmitter* from the *PostWoman* to tell her which is its state.

These are the events that will be sent depending on the situation:

- SUCCESS. The parcel has been succesfully delivered.
- RETRY. The parcel could not be delivered so it is has to be resent after the needed waiting time.
- READY. An undelivered parcel is ready to be queued to wait for its turn to be sent.
- DEAD.  A parcel has spent all of its retries and is not going to be processed any more.

In only has a couple of main methods:

- **Send()** for simulate the sending of the parcel to the employee. This sending process has been written to simulate an async method (maybe a call to an API) that lasts 1s. So this delay has been developed to simulate a real life behaviour. Without this simulation, the send call will be too quick, because is only a boolean check. So all the parcels would be sent directly and lots of logic would be unused.
- **WaitAndRetry()** when a sending process has gone wrong just to wait for a needed delay *[100ms, 300ms, 1s]* and retry the sending.

###ParcelQueueManager
It is a class to manage the parcel queues. It is meant to encapsulate all the logic referring to the queues and keep it away form the PostWoman. As she only needs to tell the queueManager to queue a parcel or to serve it, and the manager will decide where to queue it or from whence get it. 

 It has for queues:

- *premiumRetryQueue*
- *premiumNewQueue*
- *regularRetryQueue*
- *regularNewQueue*

These queues are simple JavaScript arrays and it is a reason for that. At the beggining this was aimed to use some single queue like *PriorityQueue*. Writing a comparator which would decide with priority is higher (specified in the exercise statement) this queue would sort all the items depending on their priority and the PostWoman only had to get the first one. Quick right? This has a drawback, though. It would need to sort the queue each time a new item comes, and as this system is aimed to be getting parcels "constantly" it would be expensive. 

But as it always said, usually the most simple approach is the best. Javascript arrays are fast (check this [link](https://stackoverflow.com/questions/8423493/what-is-the-performance-of-objects-arrays-in-javascript-specifically-for-googl)) A parcel can be about 4 types *[PremiumNew, PremiumRetried, RegularNew, RegularRetried]*, so lets have a queue for each. This way, as the priorities are set correctly, we know from which queue get the parcel, and this would be the first element in the queue. In addition, when we have to queue a parcel, after checking where to, we only need to put it in the last position of the queue. This can be achieved with basic operations (*shift()* to get the first one and *push()* to add the item to the end of the queue).

So this class only need a couple of basic functions:

- **queue()**. To queue the parcel. It will decide on is own where to queue it depending on the args.
- **getNextParcel()**. To serve the next parcel with the highes priority.
	- It will check in the PremiumRetryQueue. If there is nothing in it, it will go for PremiumNew ones. Otherwise it will return a premium which is waiting for a retry.
	- If there is no new premium parcels, it will look on the RegularRetried queue. Otherwise it will serve a new Premium parcel.
	- If RegularRetriedQueue is empty will go for the RegularNew ones. If it's any, it will return a regular parel to retry.
	- If the RegularNew is empty, it means that there is no parcel queued, so it will return undefined. Otherwise, return the regular one.
- **queuesAreEmpty()**. Just to check that queues are empty.

###PostWoman
The center piece of the app is the PostWoman. As the exercise statement tells, **there is only one PostWoman, so we use the Singleton pattern to ensure that**. By definition, Typescript modules are singleton (for more info see this [link](https://thedulinreport.com/2017/07/16/singletons-in-typescript/) ), so we use this feature just to export the only functionality we need, and avoid the instantiation of more PostWomen. 

The parcels will be broght by the ParcelQueueManager, so it only has to ask for another parcel, the queueManager will do its stuff to calculate the nest with the highest piority and will serve it to the PostWoman. 

Being constantly checking if a parcel is sent, when to retry, etc. can be very expensive, so it acts like an orchestrator **listening to events that gets from the parcels** and acting when needed.

Also it will initialize the *SuccessRateCheck()* and the subscription to the *ParcelEvents* the first time is imported. If the success rate is to low, it will print the message and subscribe to the Available event, which will be sent after the rate rises to an acceptable rate, to process the next parcel with the highest priority. 

To handle these events it uses an EventEmitter, which it passes to each parcel to give them the avility to "speak" via this emitter. So each parcel will throw an event when needed and the PostWoman will act in concordance. Thus, after it gets an event form the parcel, it will print the correspondent message and go for the next parcel.
 

Its execution flow would be like this:

- Get the **first** parcel.
- Calls to *SendOrQueue* to decide to send it directly or queue it. This method will decide between three options:
	- If the PostWoman is available and if it is already processing a parcel, queue it.
	- If it's not processing anything and there are no previous parcels waiting, send it.
	- Else, queue the parcel and get the next one with the highest priority.
-  As it is the first parcel, it will send it. While the parcel is beeing processed (so the PostWoman will be busy) the rest of the incoming parcel will be queued. 
-  When the parcel processing ends, it will ask for the next one to its ParcelQueueManager instance.
	- If the current processed parcel sending has gone bad, the PostWoman will queue it again when the parcel tells her that is ready to be sent, and not before. 

###StandardInputCarrier
This is a simple util to get the input from the standar input and send parcels to the PostWoman. It is thought that each line has to be in the format which specifies the exercise statement, but anyway it goes with anything you write (avoiding special characters). 
It has some simple functionality hidden if you write this commands while it is running:

- **sim**. It will start a simulation sending a parcel each second to the PostWoman. Only logs referring to parcels' state will be prompt.
- **sim --v**. It will start a simulation like the one above, but this time in verbose mode. This means that despite the parcel logs, it will prompt each parcel that is going to be sent to the PostWoman. Good to check the overall behaviour and if that the priorities are respected.
- **stop**. Stops the currently running simulation. Anyway, this only stops to send parcels to the PostWoman, so if there is any retry waiting parcel when we type this, the PostWoman will try to send those.
- **exit** Quits the carrier and ends the process. 

##How to Run
As it is an app made using ***npm*** all of its functionality is written there, anyway we will try to explain it here in more human readable mode.

First of all yo should the latest ***node*** and ***npm*** version installed. You can get the installer from [here](https://nodejs.org/es/).

After that, and assuming that you have the code in your local machine, to the folder where the projet is and run *npm i* to install all the dependendies. Now you are ready to go.

So, after getting the above done, there two options to run the code:

- Type ***npm run clean*** and ***npm run start*** to do a new clean build and start the app.
- Type ***npm run clean-start***. This command perfomrs a new clean build and starts it always. So it's my **main option when runnig the app**.

If you want to develop some new feature, you can try with ***npm run start-dev***. This will build and start an app whennever a change is made in any file.

After getting the app run, the StandardInputCarrier will be instantiated and initialiazed. So you could input some data (respecting the format in the statement) or run a simulation using the predefined commands. Remember:

- **sim**. It will start a simulation sending a parcel each second to the PostWoman. Only logs referring to parcels' state will be prompt.
- **sim --v**. It will start a simulation like the one above, but this time in verbose mode. This means that despite the parcel logs, it will prompt each parcel that is going to be sent to the PostWoman. Good to check the overall behaviour and if that the priorities are respected.
- **stop**. Stops the currently running simulation. Anyway, this only stops to send parcels to the PostWoman, so if there is any retry waiting parcel when we type this, the PostWoman will try to send those.
- **exit** Quits the carrier and ends the process. 


To run the tests, type ***npm test***. This way, we will run the tests written using [jest](https://facebook.github.io/jest/). 

	
