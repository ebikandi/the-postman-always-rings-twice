# The postwoman always rings twice
#### *by Eneko Bikandi*
In this codebase there is an approach to the Postwoman problem (explained in the *Exercise.md* file). 

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
* SantardInputCarrier.

###Parcel
It is a class that represents the objects we want to send to the employees.

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
	-  Else, queue the parcel and get the next one with the highest priority.
-  As it is the first parcel, it will send it. This sending process has been written to simulate an async method (maybe a call to an API) that lasts 1s. So this delay has been developed to simulate a real life behaviour. Without this simulation, the send call will be too quick, because is only a boolean check. So all the parcels would be sent directly and lots of logic woul be unused.  Thus, while the parcel is beeing processed (so the PostWoman will be busy) the rest of the incoming parcel will be queued. 
-  When the parcel processing ends, it will ask for the next one to its ParcelQueueManager instance.


	
