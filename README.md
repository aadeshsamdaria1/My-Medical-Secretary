# My Medical Secretary

## Overview
My Medical Secretary is a medical application designed to assist patients with serious illnesses, such as cancer, in managing their appointments and staying updated with relevant information about their disease. This project is in conjunction with the University of Melbourne, as part of the Software Project subject COMP90082 (Team ME-Wombat)

## Team
Aadesh Samdaria - Product Owner

Andre Soetrisno - Scrum Master

Sophie Von Doussa - Lead Frontend Developer

Jonathan Latti - Lead Backend Developer

Shaolong Xu - Backend Developer

Yuan Cao - Frontend Developer

## Deployment 
The mobile app cannot be deployed at this stage, as we do not have finalised details for logging in to the google playstore and app store accounts required. The backend and web app are temporarily hosted at the team's own private server. The web app can be seen at "http://mymedicalsecretary.uk.to:3000/", and the backend API can be accessed at "http://mymedicalsecretary.uk.to:8080/api/REQUEST". However, this server is not as reliable as the AWS server they will eventually be deployed on, so there are occasionally issues with accessing these hosted resources. Given this, a video of the web and mobile apps is available for viewing in the demo section below.

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
