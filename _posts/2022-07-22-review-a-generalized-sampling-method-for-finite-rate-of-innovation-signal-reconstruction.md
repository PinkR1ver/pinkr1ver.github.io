---
layout: post
title: Review:A Generalized Sampling Method for Finite-Rate-of-Innovation-Signal Reconstruction
date: 2022-07-22 23:36 +0800
author: Yichong Wang
category: Paper-Review
tags: 
  - Signal
  - M.sc
subtitle: Sampling signals that are not admissible within the classical Shannon framework 
description: Sampling signals that are not admissible within the classical Shannon framework 
---

## Article Address:
[https://ieeexplore.ieee.org/document/4682542](https://ieeexplore.ieee.org/document/4682542)

## Background
采样和重构无法在香农采样理论的经典框架内处理的信号,此类信号的示例包括狄拉克脉冲流和各种类型的非均匀样条，例如分段多项式、分段指数和分段谐波函数。这些信号由一组离散的参数（例如，奇点的幅度和位置）唯一指定，因此具有具有有限新率（FRI）

## From Dirac Impulse to Kronecker Impulse
![From Dirac impulses to Kronecker impulses](/assets/img/2022-07-22-review-a-generalized-sampling-method-for-finite-rate-of-innovation-signal-reconstruction/fig2.png)

需要理解的地方就在于(4)的$p_a(nT)$,它是由一个叫做discrete-time finite-impulse-response
filter specified by the Z-transform:$$G_a(z)=\frac{1}{a}(1-e^{-aT}z^{-T})$$的filter处理后得到的。当 (3) 中的序列由 G(z) 处理时，它会产生克罗内克脉冲流，也就是(4)

Kronecker Impulse的幅度是Dirac Impulse的幅度和位置的可分函数

## Two Channel sampling of a dirac impulse train

Kronecker Impulse的幅度是Dirac Impulse的幅度和位置的可分函数，这一特性可以给我们一种简单而有效的重建技术。

具体细节上，我们通过不同的采样内核获得另一组测量值，如下图：
![Two-channel sampling of a stream of Dirac impulses by using first-order RC networks.](/assets/img/2022-07-22-review-a-generalized-sampling-method-for-finite-rate-of-innovation-signal-reconstruction/fig3.png)

然后可以通过$$p_a(nT)$$和$$p_\gamma(nT)$$建立等式计算原信号，具体见论文

## Spline Equivalence and Effects
对于E样条(E-spline )采样（不确定Spline Equivalence的准确定义）与Dirac相似，通过多通道采样和不同的采样核重建信号，效果如下：

![Ground truth and Reconstruction](/assets/img/2022-07-22-review-a-generalized-sampling-method-for-finite-rate-of-innovation-signal-reconstruction/fig4.png)

## Conclusion
总而言之，本篇论文提出了一种双通道采样方法来使用简单的计算来检索脉冲的参数来解决了采样和重建狄拉克脉冲流的典型问题。原则上，该技术适用于无限长的脉冲序列，而无需逐块处理。

这种方法和之前传统方法的比较如下图：
![COMPARISON OF THE STANDARD AND THE PROPOSED APPROACHES](/assets/img/2022-07-22-review-a-generalized-sampling-method-for-finite-rate-of-innovation-signal-reconstruction/table.png)


