---
layout: post
title:  "Setting up SSH with a static IP on your Raspberry Pi"
date:   2021-04-17 13:27:21 -0700
categories: raspberry-pi project
tags: raspberry-pi, ssh, static-ip
---

So you've got yourself a [Raspberry Pi](https://www.raspberrypi.org/products/), and you've got it set it up so you can plug in a keyboard, mouse, monitor, and do things on it. Fun!

But also, a hassle! Are you going to do all this plugging and unplugging every time you want to do anything on it? Also, you've probably got your development environment on some other machine, and once you get it up and running with some project, are you going to move it back and forth every time you want to do anything on it?

No! You're going to set up SSH and give your little Pi a static IP on your local network, so you can always access it from your main setup, move files back and forth, check logs, hit your web server, etc., without having to do all of that stuff. Update your air quality sensor or your motion detector or your home entertainment system or whatever from the comfort of your own development environment.

I did this recently because I'm working on a network of air quality sensors for my house, because I cook with a lot of bacon and that stuff is smoky as hell and maybe that's bad? Also I live in California, which is majorly on fire these days for about a third of the year, and if I'm going to obsessively check the [air quality outside](https://www.baaqmd.gov/about-air-quality/current-air-quality/air-monitoring-data/#/aqi-highs?date=2021-04-17&view=hourly), I might as well know what it is inside too.

But, back to IP addresses. What is even the problem here?

# Daddy, where do IP addresses come from?
Well son, when a mommy network and a daddy network really love each other...wait, that's something else. 

Jekyll also offers powerful support for code snippets:

{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
