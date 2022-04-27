---
layout: post
title: Data type is medical image normalization trap
author: Yichong Wang
date: '2022-04-06'
category: BME
tags:
  - Deep learning
  - MRI
  - BME
description: data type is not always the normalization standard
subtitle: data type is not always the normalization standard
---

# Background

I want to do preprocessing to some MRI data with .nii file extension. One of the step is normalization. As usual, when our dataset is a bunch of normal images with .png file extension, its usually a 3 Channel 8-bit image with data type is uint8. So its very common to do normalization from [0-225] to [0-1] by just dividing 255 to very pixel value.

But my dataset is all float64 aka. double type.

# Wrong operation

When I first do data preprocessing, I make two fatally error. 
* Convert .nii file every slice into uint8, typical normal image in computer.
* Do normalization to every slice

First fatal is because that I do a real lossy conversation from float64 to uint8.
```python
imageio.imwrite(os.path.join(savePathAX, '{}.png'.format(i)), slice)
```
This step will auto convert your data to uint8, its a real lossy conversation.

Also, you may have a question, float64 range from 2.2E-308 to 1.7E+308, how do this code deal with the largest value. 

Actually, it will make your largest value as 255. So it means that, it already do the normalization to every image from [0 - max] to [0 - 255]. 

Its the second fatally error.

For medical image, take CT as example:

[![CT Subtance HU value](/assets/img/2022-04-06-data-type-is-medical-image-normalization-trap/Zhihu.jpg)](https://zhuanlan.zhihu.com/p/112176670)

You can find the pixel value mean, so you can find the data max bound and min bound[1].  And you can do the normalization easily:

```python
MIN_BOUND = -1000.0
MAX_BOUND = 400.0

def norm_img(image): 
    image = (image - MIN_BOUND) / (MAX_BOUND - MIN_BOUND)
    image[image > 1] = 1.
    image[image < 0] = 0.
    return image
```
(This code also from [1])

So, image that you normalize every image into [0-1], if your every image have the bone, that's fine. Every max value 1 represent bone. But if one of your image don't have bone, the max HU value represent soft tissue and you normalize it into [0-1]. So different image's 1 will have different mean, normally it means bone and some image will wrongly represent it as soft issue. 

That's why you have normalize depending on the meaning of its pixel value rather than just every image or data type max value.

Take my MRI image dataset as example, its max value is 2.6E+4 and its type is float64. If you divide it by float_max aka. 1.7E+308, all its value will be super small and if you transfer it into float32 to input into model, all its pixel value will be 0.

Lastly, in conclusion,

* Find the pixel value mean before do normalization
* Data type is not the guideline and most of time using float64 is for its precision rather than its range.


### Appdenix
[1] https://zhuanlan.zhihu.com/p/112176670

~~*For MRI Image, i don't know there has the standard or not.*~~


# Replenish Apr 8, 2022
In MRI, you can do normalization to every brain because in MRI, different machine, different machine parameter will give you real different intensity. So the absolute value of MRI image intensity is not every important, the most important value is contrast information, aka. the intensity histogram. So you can do normalization to every brain separately. 

"The same histogram can maintain the internal tissue contrast of your original individual and reduce the gray value difference between individuals" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      ---Shen (A researcher from Zhejiang University)




