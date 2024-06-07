# My Medical Secretary

## Overview
My Medical Secretary is a medical application designed to assist patients with serious illnesses, such as cancer, in managing their appointments and staying updated with relevant information about their disease. This project is in conjunction with the University of Melbourne, as part of the Software Project subject COMP90082 (Team ME-Wombat)

## Team
Aadesh Samdaria - Product Owner

Andre Soetrisno - Scrum Master

Sophie von Doussa - Lead Frontend Developer

Jonathan Latti - Lead Backend Developer

Shaolong Xu - Backend Developer

Yuan Cao - Frontend Developer

## Deployment 
The backend and the web app are currently deployed on the client's AWS EC2 instance. The web app can be accessed through the link "https://medsecapi.com/". The mobile app cannot be fully deployed to the public due to testing and legal issues with the Apple App Store and google play store. The app is currently published as a beta version on these stores, accessible only to specified beta testers. Given this, we have included a video demonstrating the UI and features of the mobile app in the youtube link below.

## Final Demo
https://www.youtube.com/watch?v=Ls60j9QaYHc

## Demo (Sprint 3) Mobile App
https://www.youtube.com/watch?v=hgyfC3yfLnw

## Demo (Sprint 2)
https://youtu.be/oWE2iZLScWE 


## Workflow
Branch Naming Conventions
Branch names should follow the following convention:

< jira-ticket > - < feature-description >

Bugfix branches should make it clear that it is a bugfix branch using bugfix/

Pull Requests should also be named with < jira-ticket > at the front. For example, 'MW-1 Fix bug'

## Merge Strategies
No work directly on main will be committed. Instead, all features and bug fixes are to be merged into the develop branch using a pull request. Once reviewed by one other team member, changes are merged into the master branch for release.
All pull requests are also required to pass the entire testing suite before being merged to main. The backend suite uses JUnit for Kotlin, and the frontend team uses Jest for React. No pull requests should contain uncovered lines of code - testing should be included in the same PR.

## Docs
Documentation for the project is available in the docs folder of the repository. These documents are linked from Confluence.

## Link to web app:
https://medsecapi.com
