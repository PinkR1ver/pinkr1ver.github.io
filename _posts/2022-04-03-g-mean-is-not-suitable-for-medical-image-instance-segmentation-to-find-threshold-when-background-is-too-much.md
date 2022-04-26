---
layout: post
title: G-mean is not suitable for medical image instance segmentation to find threshold
  when background is too much
author: Yichong Wang
date: '2022-04-03'
category: BME
tags:
  - Deep learning
  - Image Segmentation
  - Threshold
  - Python
description: Is G-mean can handle medical image instance, especially for small cancer in big brain?
subtitle: Is G-mean can handle medical image instance, especially for small cancer in big brain?
---

# Threshold
In my undergraduate FYP, I need to do image segmentation to the brain MRI to annotate the GBM cancer in patient brain.

![GBM MRI Image](/assets/img/2022-04-03-g-mean-is-not-suitable-for-medical-image-instance-segmentation-to-find-threshold-when-background-is-too-much/GBM_MRI.png)

I apply the famous architecture U-net to do this segmentation task. The last layer I apply is **sigmoid**. It outputs every pixel value in [0-1]. I was wondering which value is the best threshold for the segmentation.
![Threshold](/assets/img/2022-04-03-g-mean-is-not-suitable-for-medical-image-instance-segmentation-to-find-threshold-when-background-is-too-much/Threshold.png)
In the beginning, I set threshold as 0.5, but the data is very imbalance that the background is much more than the cancer area. It means that 0 value pixel is much more that 1 value pixel. It will lead to 0.5 is not a suitable value to distinguish 1 and 0. You can check this link to learn the detail:

https://towardsdatascience.com/optimal-threshold-for-imbalanced-classification-5884e870c293

# ROC curve
ROC (Receiver operating characteristic), is a graphical plot that illustrates the diagnostic ability of a binary classifier system as its discrimination threshold is varied. It is created by plotting the true positive rate (TPR) against the false positive rate (FPR) at various threshold settings. 

![ROC Curve](/assets/img/2022-04-03-g-mean-is-not-suitable-for-medical-image-instance-segmentation-to-find-threshold-when-background-is-too-much/Roccurves.png)

It has two usages here:
1. Compare different method in binary classification.
2. Find best threshold for binary classification

For the usage 1, it is always using AUC (Area under curve) to determine which classification method is better. 

And for usage 2, which is the part I want to talk about, it always want to choose the most up left point to be our threshold. It is very easy to understand because the more left, the false positive rate will be more less,  the more up, the true positive rate will be more bigger. But how to evaluate the best left up point in ROC curve? As the article in [link above](https://towardsdatascience.com/optimal-threshold-for-imbalanced-classification-5884e870c293) shiows that, it usually use a paramter called G-mean:

![G-mean](/assets/img/2022-04-03-g-mean-is-not-suitable-for-medical-image-instance-segmentation-to-find-threshold-when-background-is-too-much/Gmean.png)

You can see that G-mean take both sensitivity and specificity into consideration. The result will be a tradeoff for 0 and 1 classification. The point here is that G-mean take 0 and 1 as the same importance. It will be great if we classify banana and apple, or some other two thing in a same significance. It will solve the imbalance. 

But the question is that, in medical segmentation to segment cancer area. We do not think cancer area and normal area as same importance. So using  G-mean to determine threshold will result:

***I do the ROC calculating to find the bigger G-mean point to determine threshold in epoch 10, and you can see the problem.***

![Roc curve](/assets/img/2022-04-03-g-mean-is-not-suitable-for-medical-image-instance-segmentation-to-find-threshold-when-background-is-too-much/RealRoc.png)

![Specificity](/assets/img/2022-04-03-g-mean-is-not-suitable-for-medical-image-instance-segmentation-to-find-threshold-when-background-is-too-much/epoch2_epoch12_specificity.png)

![Sensitivity](/assets/img/2022-04-03-g-mean-is-not-suitable-for-medical-image-instance-segmentation-to-find-threshold-when-background-is-too-much/epoch2_epoch12_sensitivity.png)
As you can see, to make G-mean bigger, we choose the threshold that will sacrifice specificity to increase sensitivity. Because in my dataset, the background is so much, so specificity will be so close to 1. Even you predict more cancer area, aka. more white part, the specificity will be influenced very little. 

As you can see, the specificity decrease from 1 to 0.94, but the sensitivity increase from 0.65 - 1. 

To be more clear, see the graph:

![example](/assets/img/2022-04-03-g-mean-is-not-suitable-for-medical-image-instance-segmentation-to-find-threshold-when-background-is-too-much/1025.png)
The left is original image, the middle is ground truth, the right is prediction.

As you can see, the net wants to predict more white part to increase sensitivity and because it have a lot of picture with huge black part, the specificity will not be influenced more. So finally, choose the biggest G-mean point will lead to:

![f1score](/assets/img/2022-04-03-g-mean-is-not-suitable-for-medical-image-instance-segmentation-to-find-threshold-when-background-is-too-much/epoch2_epoch12_f1score.png)

![IoU](/assets/img/2022-04-03-g-mean-is-not-suitable-for-medical-image-instance-segmentation-to-find-threshold-when-background-is-too-much/epoch2_epoch12_IoU.png)

The most important parameter we take attention to: f1-score and IoU will dramatically decrease. 

In conclusion, when you meet this situation:

* Imbalance Data
* You take more attention and account to the small part type of your dataset. (The Brain cancer segmentation in MRI is this typical example )

You have better not use G-mean to determine which threshold you shold deploy.
