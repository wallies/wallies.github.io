---
layout: post
title: "Teaching Apollo to Learn"
description: "TensorFlow Serving with Mesos & Spark support"
category: "Devops"
author: cam_parry
tags: [Development, Devops, Big Data, Docker]
comments: true
share: true
---


So the story starts out, like most stories in the tech industry these days, some cool new piece of software for doing something comes along, that makes things easier to do and everyone jumps onboard and there are hundreds of blog articles and github repositories in under a day showing you the crazy ways people are playing with this new tech. 

For me this just happened to be [TensorFlow Serving](http://tensorflow.github.io/serving/architecture_overview). I have been meaning to play around with some Big Data tools for a while now, so this gave me the perfect excuse and I wanted to see what all the hype was about. I have added some [Extra Tutorials, Guides & Architectures](#Extra Tutorials, Guides & Architectures) and [Distributed TensorFlow](#Distributed TensorFlow) tid bits at the bottom of this article around TensorFlow, as there is always more than one way to crack an egg, and some of these other ways might be better for your use case.

### Setup
I started out like anyone would by going to the [installation](http://tensorflow.github.io/serving/setup) page, but couldnt find any instructions that would actually help me, as it just talks about building from source. After hours of compiling files I really had no idea what I was doing, I ran into this issue [here](https://github.com/tensorflow/serving/issues/30). I looked around on the internet, solved it by looking into this [issue](https://github.com/tensorflow/serving/issues/6) but ultimately ran into alot of other issues. What I should of done was look at [issue#1](https://github.com/tensorflow/serving/issues/1) and I would of seen that there is no support for OS X and to just run it up using docker. I thought about this, but I thought I would see if I could add some Big Data support to [Apollo](https://github.com/Capgemini/Apollo) why I was at it and as Apollo, is based on [Mesos](http://mesos.apache.org/) I thought my best bet would be to use the [Kubernetes tutorial](http://tensorflow.github.io/serving/serving_inception). 

I had also been working on adding [Rackspace](https://www.rackspace.com/) support to Apollo, so thought what better way of also getting this ticked off the list. Plus I could take advantage of Rackspace Bare Metal servers for the Spark and TensorFlow servers, which is the perfect use case.

So I have my mesos cluster running on Rackspace and using the [DCOS CLI](https://docs.mesosphere.com/usage/cli/) I can install Spark by running: ``` dcos package install spark ``` or by going to 'group_vars/all' file in Apollo project and changing the spark_enabled variable to true. This will automatically install the spark framework and handle everything for you.

This will install [Spark Mesos Framework](http://spark.apache.org/docs/latest/running-on-mesos.html). Now while Spark starts up, I will explain why I have diverged off and included Spark, when this article is about TensorFlow. Originally I had just planned to run TensorFlow but then I started reading a couple of blogs about Hyperparameter Tuning/Optimisation. Basically they say to use Spark to do distributed neural network training which leads to massive reduction time and lower error rates. This is all covered [here](https://databricks.com/blog/2016/01/25/deep-learning-with-spark-and-tensorflow.html), in a great post from the team at Databricks. Of course Spark isn't the only way we can do this but I believe it is the most powerful as it allows us to build more complicated pipelines. [Distributed TensorFlow](#Distributed TensorFlow) explains the details in depth about using Spark, AWS EC2 and Distributed TensorFlow.

So now to deploy TensorFlow. Here is a [gist](https://gist.github.com/wallies/02a679a542c882dae2a140030b0e1043) to the Tensorflow Inception [Marathon](https://mesosphere.github.io/marathon/) file. This will take awhile as the docker image is quite large. In the meantime go read up on some of the other demos people have tried in the [Extra Tutorials, Guides & Architectures](#Extra Tutorials, Guides & Architectures) section below.

Once you have the green health check in the Marathon UI. The IP Address '52.50.8.153' listed here is the server running your Spark instance. You can get this by clicking on the Spark in Marathon UI and it should list the server IP it is running on. 

You can now query Tensorflow with the path to the image you want analysed. Your output should be the classes / classification of things seen in the image.

```
docker run --name=inception_container -it gcr.io/tensorflow-serving/inception /serving/
bazel-bin/tensorflow_serving/example/inception_client
--server=52.50.8.153:9000 --image=/path/to/my_image.jpg
```

### Bonuses
If you also want to try running this up on GPU machines, Mesos does have support for GPUs, but isolation support has not landed yet but you can head over to the [TensorFlow Mesos Framework](https://github.com/douban/tfmesos) being built, which looks promising and even has some early support for GPUs.

Last month [Google Cloud Vision](https://cloud.google.com/vision/) also graduated to General Availability. For those not wishing to experiment on their own, I recommend taking a look at Google Cloud Vision, as it looks quite nice.


### Distributed TensorFlow
- [Deep Learning with Spark and TensorFlow](https://databricks.com/blog/2016/01/25/deep-learning-with-spark-and-tensorflow.html)
- [Large Scale Deep Learning With TensorFlow on EC2 Spot Instances](http://eugenezhulenev.com/blog/2016/02/01/deep-learning-with-tensorflow-on-ec2-spot-instances/)
- [Scaling Googles Deep Learning Library on Spark](http://www.slideshare.net/arimoinc/distributed-tensorflow-scaling-googles-deep-learning-library-on-spark-58527889)
- [Distributed TensorFlow](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/g3doc/how_tos/distributed/index.md)


### Extra Tutorials, Guides & Architectures
- [Nvidia GPU + CoreOS + Docker + TensorFlow](http://www.emergingstack.com/2016/01/10/Nvidia-GPU-plus-CoreOS-plus-Docker-plus-TensorFlow.html) 
- [TensorFlow-Tutorials](https://github.com/nlintz/TensorFlow-Tutorials)
- [TFLearn](https://github.com/tflearn/tflearn)
- [Scikit & TFLearn](https://medium.com/@ilblackdragon/tensorflow-tutorial-part-1-c559c63c0cb1#.46fy3pp0h)
- [TFLearn Examples](http://tflearn.org/examples/)
- [Number Plate Recognition with Tensorflow](http://matthewearl.github.io/2016/05/06/cnn-anpr/)
- [TensorFlow on Azure Using Docker](http://www.mikelanzetta.com/2015/12/tensorflow-on-azure-using-docker/)
