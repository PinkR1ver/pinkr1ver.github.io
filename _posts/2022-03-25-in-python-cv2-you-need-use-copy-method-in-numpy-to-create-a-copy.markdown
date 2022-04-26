---
layout: post
title: In python cv2, you need use .copy() method in Numpy to create a copy
author: Yichong Wang
date: '2022-03-25'
category: Python
tags:
  - Python
  - opencv-python
description: In python cv2, you need use .copy() method in Numpy to create a copy
subtitle: shallow copy and deep copy?
---

Recently, I need to upload my graduation photo in China. There are lots of requirements, so I need to do some processing to my picture. One of them is to do offset, moving the picture pixel value down. 

Because I don't very familiar with cv2 function, so I decide to do brute force way, using `for loop`

```python
new_img = img

for i in range(20, img.shape[0]):
    for j in range(img.shape[1]):
        new_img[i, j] = img[i - 20, j]

for i in range(20):
    for j in range(img.shape[1]):
        new_img[i, j] = img[i, j]
```

But with this code, the result will be wrong like that:
## Original Image:
![](/assets/img/2022-03-25-in-python-cv2-you-need-use-copy-method-in-numpy-to-create-a-copy/images.png)

## Wrong Results:
![](/assets/img/2022-03-25-in-python-cv2-you-need-use-copy-method-in-numpy-to-create-a-copy/NewImage.jpg)

If you use another method to do this:
```python
new_img = img[:235,:]
bak = img[0:20,:]


new_img = np.append(bak, new_img, axis=0)


plt.imshow(img)
plt.show()

```
## Expected Results:
![](/assets/img/2022-03-25-in-python-cv2-you-need-use-copy-method-in-numpy-to-create-a-copy/NewImage2.jpg)

The reason why is that when you code `new_img = img` in python. The numpy will not create a real variable with new address. See this code:
```python
import numpy as np

x = np.ones((255, 255, 3))
y = x

for i in range(1, x.shape[1]):
    y[i] = x[i - 1]
print(id(y))
print(id(x))

> 2410142026512
> 2410142026512

```
Guess what, the result is that address of x and y is the same. I guess that when numpy has some calculation will alert numpy to create a real variable. If there is just '=', the numpy will not create real variable. So you need to use .copy() function to create copy of one variable, rather than '=' .

I also ask this question in [stackoverflow](https://stackoverflow.com/questions/71606098/python-opencv2-for-loop-to-change-image-pixel-value?noredirect=1#comment126563050_71606098). This answer is so great. It introduce the concept about **shallow copy and deep copy**.

![](/assets/img/2022-03-25-in-python-cv2-you-need-use-copy-method-in-numpy-to-create-a-copy/ShallowCopy&DeepCopy.png)
