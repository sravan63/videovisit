                                <%@page import="java.util.ResourceBundle"%>
                                <% 
                                ResourceBundle rbInfo = ResourceBundle.getBundle("configuration");
                            	String setupUrl = rbInfo.getString("MEGA_MEETING_SETUP_URL");
                                %>

								
								<img src="images/global/back-intro2.jpg" width="439" height="316" alt="" class="intro-image">
                                <h3 class="page-title">Welcome to Video Visits </h3>

                                <p class="login">Kaiser Permanente is pleased to offer you the opportunity to meet with your doctor by video.  This new information technology allows you to securely talk with your doctor from the convenience of your home or office, without having to drive to your doctor's office.  You will need a computer, webcam, broadband internet connection, and the latest version of <a href="http://www.adobe.com/software/flash/about/">Adobe Flash</a>.</p>
                                <p class="login">If this is your first video visit, please take a moment to make sure that this system works well on your computer by using our <a onclick="javascript:popUrl('<%=setupUrl%>');" href="#"> Setup Wizard</a> </p>
								<p class="login">You will be able to enter your video visit within 15 minutes before your appointment time. </p>
								<p class="login">Please make sure you have the latest version of <a href="http://www.adobe.com/software/flash/about/">Adobe Flash</a> before proceeding.</p>

                                <p class="login"><a href="login.htm" class="button">Get Started &rsaquo;&rsaquo;</a></p>
