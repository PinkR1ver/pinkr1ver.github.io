---
layout: post
title: What is .nii file?
author: Yichong Wang
date: '2022-03-08'
category: BME
tags:
  - BME
  - MRI
description: As a BME student, I always meet .nii file though my third and fourth year in college. But I don't understand .nii file for a long while. So I want to explain the .nii file format very simply to everyone majored in BME.
subtitle: metadata is the most important part you need know in NIfTI file
---
# What is .nii file? 

As a BME student, I always meet .nii file though my third and fourth year in college. But I don't understand .nii file for a long while. So I want to explain the .nii file format very simply to everyone majored in BME.

## What is NIfTI?
The first thing we need to know is the background of .nii file -- NIfTI (Neuroimaing Informatics Technology Initiative). NIfTI file format was envisioned about a decade ago as a replacement to the then widespread, yet problematic, analyze 7.5 file format.[1] The main problem of previous file format is lacking adequate information about orientation in space. The primary goal of NIfTI is to provide coordinated and targeted service, training, and research to speed the development and enhance the utility of informatics tools related to neuroimaging.[2]

## NIfTI-1 & NIfTI-2
The new format called NIfTI-1, which was defined in two meetings of the so called Data Format Working Group(DFWG) and the National Insitutes of Health(NIH), one in the 31 March and another in 02 September of 2003[1]. NIfTI-2 improves the data types supported by NIfTI-1, as well as precision and voxel size[3].
Both .nii and .nii.gz are the common file extension name for NIfTI file format and commonly, the are both acceptable for most of software. (.nii,gz is .nii compression file)

## Detail Data Information
We can learn NIfTI file by reading it metadata[4], you can also useing
```
info = niftiinfo(filename)
```
in MATLAB to read meta data from .nii file. 
You can see:
```
ans = struct with fields:
        sizeof_hdr: 348
          dim_info: ' '
               dim: [3 256 256 21 1 1 1 1]
         intent_p1: 0
         intent_p2: 0
         intent_p3: 0
       intent_code: 0
          datatype: 2
            bitpix: 8
       slice_start: 0
            pixdim: [1 1 1 1 0 0 0 0]
        vox_offset: 352
         scl_slope: 0
         scl_inter: 0
         slice_end: 0
        slice_code: 0
        xyzt_units: 0
           cal_max: 0
           cal_min: 0
    slice_duration: 0
           toffset: 0
           descrip: ''
          aux_file: ''
        qform_code: 0
        sform_code: 0
         quatern_b: 0
         quatern_c: 0
         quatern_d: 0
         qoffset_x: 0
         qoffset_y: 0
         qoffset_z: 0
            srow_x: [0 0 0 0]
            srow_y: [0 0 0 0]
            srow_z: [0 0 0 0]
       intent_name: ''
             magic: 'n+1 '
```
These metadata all stored in the header, which you cann look up offical doc [nifti1.h](https://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1.h) to see how this metadata store. 
And you can use [hexyl](https://github.com/sharkdp/hexyl) to show hex code of header info.
```
hexyl -n 348 filenaem.nii
```
There are some important header info to show how NIfTI file works.

### ...

## Appendix and Reference
[1] https://brainder.org/2012/09/23/the-nifti-file-format/

[2] https://nifti.nimh.nih.gov/

[3] https://docs.safe.com/fme/html/FME_Desktop_Documentation/FME_ReadersWriters/nifti/nifti.htm

[4] https://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1.h
