# ![protoculture](protoculture.png)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://badge.fury.io/js/protoculture-hapi.svg)](https://badge.fury.io/js/protoculture-hapi)
[![Build Status](https://travis-ci.org/atrauzzi/protoculture-hapi.svg?branch=master)](https://travis-ci.org/atrauzzi/protoculture-hapi) 
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## About
Protoculture-hapi is an integration between the [protoculture application framework](https://github.com/atrauzzi/protoculture) and the [hapi server framework](https://hapijs.com).

### In Detail
Hapi offers a great server-side HTTP abstraction with a broad ecosystem of plugins and documentation.  Combined with the availability of great
community maintained typing definitions, hapi seems like a sure bet!

Most of what this library offers sits on top of hapi and as such, I make every effort to ensure the standard hapi documentation continues to 
apply.  Hapi offers a lot already, so where possible, protoculture-hapi integrates - but everywhere else, it stays out of the way.

#### Service Providers
Service providers are included for the following functionality (packages):

 - Static file hosting ([Inert](https://github.com/hapijs/inert))
 - Sessions ([Yar](https://github.com/hapijs/yar))
 - Third party authentication ([Bell](https://github.com/hapijs/bell))

 These abstractions are typical for most web projects, and the overhead of separate libraries maybe doesn't quite make sense for them yet.  It's all opt-in via the service providers, so rest assured you won't incur overhead at runtime for anything you don't use.

#### Dependency Injection
Like many pure JS libraries, hapi does not natively feature any kind of dependency injection.  The nice thing is that hapi is so well factored, 
setting up dependency injection is straightforward.

All you have to do is bind routes and define handlers either as the regular hapi route structure, or using `Route` instances which is where the real
magic happens.

#### Async
Because hapi is callback based, it's easy for protoculture-hapi to bootstrap asynchronous request handlers.  That means all your handlers 
can now be async!

## Meta
Protoculture-hapi is created by Alexander Trauzzi and is available under the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0.html).

### History
Created as per [this github ticket](https://github.com/atrauzzi/protoculture/issues/10)!

I chose hapi as the first http library to integrate protoculture with for a number of reasons.  First obviously is that it has 
a great [track record and list of ongoing supporters](https://hapijs.com/community).  Second is that I've read a lot of [Eran Hammer](https://twitter.com/eranhammer)'s writing and 
social media activity and like what he contributes to the various development communities.

Thirdly, any developer who is also a [John K.](https://en.wikipedia.org/wiki/John_Kricfalusi) fan is pretty much obligated to try hapi!

### Other
Head over to the [main protoculture repository](http://github.com/atrauzzi/protoculture) to learn more!
