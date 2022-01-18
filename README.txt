
# TehnologiiWebFacultyProject
Tehnologii Web Faculty Project

Database used: MariaDB

Models: 
Profesor -> profId, nume, prenume, email, pass
Activity -> activityId, profid, nameActivity, code,
Feedback -> feedback, activityId
AuthToken -> token, profId

Views:
HomePage
ProfesorView - > PopupFeedback
StudentView
ExitPage
404

Login/Sign up page
btnProf- > loginController(SignUp/Login views) - > ProfView - > exitview -> back to home
btnCode - > studentView -> exitview
createAccount()
login() - >checkcreds
  
Main page
addActivity()- >add act to db
viewFeedback -> PopUp cu feedback (GET from DB)
loginCode() - > stud - > check if code exists and time is not over
sendFeedback(feedback, timestamp)
logout()
goHome()
	

Controller:
POST createacc(nume, prenume, email, pass) - > OK(200) / Bad(400)
POST login(email, pass) => { id, nume, prenume, email} / 400 
POST logout() ..
POST addActivity(nume, cod, timelimit(LocalDateTime)) -> OK -> refresh
GET getAllActivities(idprof) => [lista_activitati] jsonarray
GET getFeedbackForActivity(idactivity/codeactivity, profId) => if loggedProf == profId
GET getActivityForStudByCode(activityCode) = > retuns activity object from db and reroutes to activityview(Activity)
POST sendFeedback(idActivity, FeedbackEnum:value, timestamp)
