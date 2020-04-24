# The postwoman always rings twice

We have two inboxes where we collect parcels arriving at the office: one for premium service and the other for regular deliveries.
Our postwoman will take care of them and will deliver to our employees.
Because some parcels won't be successfully delivered, we need to implement a retry policy to make sure 
our engineers get all their gadgets, or at least we'll try a few times.

There are two reasons why the parcel cannot be delivered:

* Employee is not at her desk. In this case retry logic will be applied:
    * postwoman will retry after 100ms, 300ms and 1s.
    * If parcel could not be delivered after 3 retries, it will be queued in a dead letter (we won't process them anymore).
* The postwoman is not available: we'll have to wait 1 second until she is back since we do not want all parcels being processed 
during her absence (all of them would go through the retry logic).
This does not mean we stop receiving parcels to the inboxes.

**Priorities**

Since parcels can be sent with the premium service, as you can imagine, this parcels will have higher priority than others to be delivered.
These are the rules to follow to guarantee the right delivery order:

* Parcels with premium service have priority over regular ones.
* Parcels being retried have preference over the new ones.
* Any premium parcel (new/retried) have preference over a regular parcel retried.
* When a parcel cannot be delivered, we want the postwoman to continue delivering next parcels without waiting for the retry.
* A retry must be processed ASAP after the timeout following the previous rules of precedence.

**Remember we only have ONE postwoman at the office for delivery ;)**

## It is requested:

Build a system that simulates this scenario taking into account the following considerations:

* Parcels can arrive to the inboxes by different carriers but you only need to implement the "standard input carrier" where
every line will be a new parcel arriving through the standard input. This would be an input example (Shipment code, employee, premium):
```
SHIP001,employee1,0\n
SHIP002,employee2,0\n
SHIP005,employee1,1\n
SHIP008,employee1,0\n
```
* The failure of a delivery will be simulated by a random function that will change the probability of failures every second by randomly
picking one between 5% and 20%. This applies to the retries too.
* When do we consider the postwoman is not available? you are requested to monitor successful delivery ratio at intervals
of 1 second and consider that the postwoman is not available when the ratio is lower than 85%. In this case we'll wait 1 second
until she is back.
* The output is a log as follows:
    * INFO: parcels successfully delivered.
    * WARN: parcel failed to be delivered.
    * ERROR: parcel won't be delivered (max retries exceeded).
    * CRITICAL: postwoman not available.
```
31 Oct 2017 13:00:23,103 [INFO] Parcel SHIP001 successfully delivered to employee1. Retries: 0
31 Oct 2017 13:00:23,203 [WARN] Parcel SHIP002 failed to be delivered to employee2. Retries: 0
31 Oct 2017 13:00:23,303 [INFO] Parcel SHIP002 successfully delivered to employee2. Retries: 1
...
31 Oct 2017 13:00:23,413 [ERROR] Parcel SHIPXXX won't be delivered to employeeX. Retries: 3
...
31 Oct 2017 13:00:53,403 [CRITICAL] postwoman not available
...
```


## Observations:

* Choose the language you feel very comfortable writing real code.
* **Do not use frameworks (do not use Grails, Spring, Rails, Django nor similar ones. Do not use data bases, keep it simple). We want to see your code ;)**
* We appreciate good practices and design patterns, so take care of concepts like modularization, extensibility, maintenance among others.
* Make your code readable.
* Implement the most efficient data structures and algorithms that better fit to solve the problem.
* Let us know how to run your code.
* Extra ball: testing is more than welcome.