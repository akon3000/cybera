import React from 'react';
import Section from '../Section';

import Header1Loader from '../Section/Header/Header1/loader';
import Header2Loader from '../Section/Header/Header2/loader';

import Footer1Loader from '../Section/Footer/Footer1/loader';
import Footer2Loader from '../Section/Footer/Footer2/loader';

import AboutUs1Loader from '../Section/AboutUs/AboutUs1/loader';
import AboutUs11Loader from '../Section/AboutUs/AboutUs11/loader';

import ImageSlider1Loader from '../Section/ImageSlider/ImageSlider1/loader';
import ImageSlider2Loader from '../Section/ImageSlider/ImageSlider2/loader';

import ImageGallery1Loader from '../Section/ImageGallery/ImageGallery1/loader';
import ImageGallery2Loader from '../Section/ImageGallery/ImageGallery2/loader';

import Banner2Loader from '../Section/Banner/Banner2/loader';

import Calendar2Loader from '../Section/Calendar/Calendar2/loader';

import Clients1Loader from '../Section/Clients/Clients1/loader';

import SocialMediaLink1Loader from '../Section/SocialMediaLink/SocialMediaLink1/loader';

import SplitContent3Loader from '../Section/SplitContent/SplitContent3/loader';
import SplitContent6Loader from '../Section/SplitContent/SplitContent6/loader';
import SplitContent8Loader from '../Section/SplitContent/SplitContent8/loader';

import GoogleMap1Loader from '../Section/GoogleMap/GoogleMap1/loader';

import Faq1Loader from '../Section/FAQ/FAQ1/loader';

import HorizontalTab1Loader from '../Section/HorizontalTab/HorizontalTab1/loader';

import MeetTheTeam5Loader from '../Section/MeetTheTeam/MeetTheTeam5/loader';
import BlogDetails1Loader from '../Section/BlogDetails/BlogDetails1/loader';

import VerticalTab1Loader from '../Section/VerticalTab/VerticalTab1/loader';

import OpeningHours2Loader from '../Section/OpeningHours/OpeningHours2/loader';
import OpeningHours8Loader from '../Section/OpeningHours/OpeningHours8/loader';

import Project1Loader from '../Section/Project/Project1/loader';
import Project3Loader from '../Section/Project/Project3/loader';

import Service1Loader from '../Section/Service/Service1/loader';

import Testimonials1Loader from '../Section/Testimonials/Testimonials1/loader';

import BlogList3Loader from '../Section/BlogList/BlogList3/loader';

import Subscribe1Loader from '../Section/Subscribe/Subscribe1/loader';

export default {
  getHeader: (section) => {
    switch (section.design) {
      case 'Header1':
        return <Section load={Header1Loader} {...section} />;
      case 'Header2':
        return <Section load={Header2Loader} {...section} />;
      default:
        return null;
    }
  },
  getFooter: (section) => {
    switch (section.design) {
      case 'Footer1':
        return <Section load={Footer1Loader} {...section} />;
      case 'Footer2':
        return <Section load={Footer2Loader} {...section} />;
      default:
        return null;
    }
  },
  getBody: (section) => {
    switch (section.design) {
      case 'AboutUs1':
        return <Section key={`${section.design}_${section.id}`} load={AboutUs1Loader} {...section} />;
      case 'AboutUs11':
        return <Section key={`${section.design}_${section.id}`} load={AboutUs11Loader} {...section} />;
      case 'ImageSlider1':
        return <Section key={`${section.design}_${section.id}`} load={ImageSlider1Loader} {...section} />;
      case 'ImageSlider2':
        return <Section key={`${section.design}_${section.id}`} load={ImageSlider2Loader} {...section} />;
      case 'ImageGallery1':
        return <Section key={`${section.design}_${section.id}`} load={ImageGallery1Loader} {...section} />;
      case 'ImageGallery3':
        return <Section key={`${section.design}_${section.id}`} load={ImageGallery2Loader} {...section} />;
      case 'Banner2':
        return <Section key={`${section.design}_${section.id}`} load={Banner2Loader} {...section} />;
      case 'Calendar2':
        return <Section key={`${section.design}_${section.id}`} load={Calendar2Loader} {...section} />;
      case 'Clients1':
        return <Section key={`${section.design}_${section.id}`} load={Clients1Loader} {...section} />;
      case 'SocialMediaLink1':
        return <Section key={`${section.design}_${section.id}`} load={SocialMediaLink1Loader} {...section} />;
      case 'SplitContent3':
        return <Section key={`${section.design}_${section.id}`} load={SplitContent3Loader} {...section} />;
      case 'SplitContent6':
        return <Section key={`${section.design}_${section.id}`} load={SplitContent6Loader} {...section} />;
      case 'SplitContent8':
        return <Section key={`${section.design}_${section.id}`} load={SplitContent8Loader} {...section} />;
      case 'GoogleMap1':
        return <Section key={`${section.design}_${section.id}`} load={GoogleMap1Loader} {...section} />;
      case 'FAQ1':
        return <Section key={`${section.design}_${section.id}`} load={Faq1Loader} {...section} />;
      case 'HorizontalTab1':
        return <Section key={`${section.design}_${section.id}`} load={HorizontalTab1Loader} {...section} />;
      case 'MeetTheTeam5':
        return <Section key={`${section.design}_${section.id}`} load={MeetTheTeam5Loader} {...section} />;
      case 'VerticalTab1':
        return <Section key={`${section.design}_${section.id}`} load={VerticalTab1Loader} {...section} />;
      case 'OpeningHours2':
        return <Section key={`${section.design}_${section.id}`} load={OpeningHours2Loader} {...section} />;
      case 'OpeningHours8':
        return <Section key={`${section.design}_${section.id}`} load={OpeningHours8Loader} {...section} />;
      case 'Project1':
        return <Section key={`${section.design}_${section.id}`} load={Project1Loader} {...section} />;
      case 'Project3':
        return <Section key={`${section.design}_${section.id}`} load={Project3Loader} {...section} />;
      case 'Service1':
        return <Section key={`${section.design}_${section.id}`} load={Service1Loader} {...section} />;
      case 'Testimonials1':
        return <Section key={`${section.design}_${section.id}`} load={Testimonials1Loader} {...section} />;
      case 'BlogDetails1':
        return <Section key={`${section.design}_${section.id}`} load={BlogDetails1Loader} {...section} />;
      case 'BlogList3':
        return <Section key={`${section.design}_${section.id}`} load={BlogList3Loader} {...section} />;
      case 'Subscribe1':
        return <Section key={`${section.design}_${section.id}`} load={Subscribe1Loader} {...section} />;
      default:
        return <div key={`${section.design}_${section.id}`}>xx</div>;
    }
  },
};
