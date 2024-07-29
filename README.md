# CS416 - Final Project

## Narrative Visualization

### US Car Accidents in 2011

#### Narrative Visualization Report

##### Nafis Chowdhury

###### Messaging:

This project provides interactive visualizations of US car accident data in 2011 using D3.js. We can explore various charts to understand the patterns and trends in car accidents across the United States in 2011. The dataset contains different categories of State, Atmospheric_Condition, Crash_Date, Fatalities_in_Crash, Gender, Injury_Severity etc. This project aims to provide meaningful insights through visualizations.

###### Narrative Structure:

This visualization project follows the interactive slideshow structure. There are 5 slides in total. The "Home" slide talks about the project in brief and how an user can navigate through. After the "Home" button, there are 4 different buttons also exist which give the user ability to go through differnt chart like bar chart, bubble chart, single line chart, and dotted chart.

###### Visual Structure:

There are total 5 slides. The "Home" button talks about the brief introduction of the project. The "First Slide" gives the user ability to visualize the bar chart. The bar chart talks about the "Atmospheric_Condition" and how many fatalities happened due to that. The "Second Slide" talks about the different categories of "Injury_Severity" for the accident as a bubble chart. The "Third Slide" helps to visualize the deaths of each day and categorized as monthly basis. "Fourth Slide" showws the differnt gender of the people based on the each month.

###### Scenes:

The scenes follow different attributes like gender, injury_severity, atmospheric_condition etc. The first slide shows the bar chart, whereas the second slides shows the bubble chart. Again, the third slide shows the single line chart and the fourth slide shows the dotted chart. So, the user can also see the different categories and easily visualize it.

###### Annotations:

The annotations uses where the static to guide the viewer to understand what the data visualizations meant. Additionally, d3-annotation library is used to show more insight of the data. In the "Third Slide" I used the annotation to show the highest fatalities and lowest fatalities in the chart.

###### Parameters:

The parameters that were used are gender, injury_severity, atmospheric_condition, crash_date, number_of_fatalities etc. In the "First Slide" the atmospheric_condition and the number_of_fatalities were used. In the second slide, the injury_severity and number_of_fatalities were used. Whereas in the third slide, the aggregation of crash_date were used with number_of_fatalities . And int eh last slide, I have used same as third slide.

###### Triggers:

There are few main triggers in the project. The first is the different slide buttons which helps the users to navigate thorugh different types of visualization. In the "Second Slide" the tooltip was implementaed which gives the user more details about the insight. Lastly, in the fourth slide, different gender are shown. If user selects a specific gender it will then trigger and update the chart based on that.
