import React from "react";
import { MessageService } from '../../services/message-service.js';
import GlobalConfig from '../../services/global.config';
import VVCheckBox from '../../components/checkbox/vv-checkbox';
import VVRadioButton from '../../components/radio-button/vv-radio-button';
import './survey-modal.less';

class SurveyModal extends React.Component {

    constructor(props) {
        super(props);
        this.ratings = [1,2,3,4,5];
        this.state = { showOverlay: false, survey: {data: [], heading:'', feedback:[]}, disableSubmit: true};
        this.checkboxes = [];
    }

    componentDidMount() {
        this.subscription = MessageService.getMessage().subscribe((notification) => {
            switch (notification.text) {
                case GlobalConfig.OPEN_SURVEY_MODAL:
                    if(this.state.showOverlay){
                        this.setState({showOverlay : false});
                    }
                    var sQuestions = notification.data.questions;
                    sQuestions.sort(function(a, b) { return parseInt(a.sequenceNr) - parseInt(b.sequenceNr); });
                    this.setState({
                        survey : { data : sQuestions, heading: notification.data.surveyText, feedback: [] },
                        disableSubmit: true,
                        showOverlay : true
                    }, () =>{
                        this.addDefaultFeedbackValues();
                    });
                    break;
                case GlobalConfig.CLOSE_SURVEY_MODAL_AUTOMATICALLY:
                    this.setState({showOverlay : false});
                    break;
            }
        });

    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

    closePopup(data, event) {
        if(data == 'close'){
            MessageService.sendMessage(GlobalConfig.CLOSE_SURVEY_MODAL, null);
        } else {
            MessageService.sendMessage(GlobalConfig.CLOSE_SURVEY_MODAL, this.state.survey.feedback);
        }
        this.setState({showOverlay : false});
    }

    addDefaultFeedbackValues(){
        this.state.survey.data.map((item)=>{
            if(item.displayControlName !== 'rating'){
                item.questionAnswers.map((answer)=>{
                    if(item.displayControlName == 'checkbox'){
                        if(answer.defaultSelected){
                            this.checkboxes.push(answer.displayAnswer);
                            this.addFeedback(item.questionId, this.checkboxes.join(','));
                        }
                    } else if(item.displayControlName == 'radiobutton') {
                        if(answer.defaultSelected){
                            this.addFeedback(item.questionId, answer.displayAnswer);
                        }
                    } else {
                        if(answer.displayAnswer){
                            this.addFeedback(item.questionId, answer.displayAnswer);
                        }
                    }
                });
            }
        });
    }

    addFeedback(qId, feedback) {
        if(this.state.survey.feedback.length == 0){
            this.state.survey.feedback.push({ questionId: qId, answer: feedback });
            this.setState({disableSubmit : false});
            return;
        }
        let available = false;
        for(var s = 0; s < this.state.survey.feedback.length; s++){
			if(this.state.survey.feedback[s].questionId == qId){
                this.state.survey.feedback[s].answer = feedback;
                available = true;
			}
        }
        if(!available){
            this.state.survey.feedback.push({ questionId: qId, answer: feedback });
        }
        this.setState({disableSubmit : false});
    }

    surveySelect(item, event) {
        const target = event.target;
        const value = target.type === 'checkbox' || target.type === 'radio' ? target.checked : target.value;
        const name = target.name;
        let index;
        if(target.type == 'checkbox'){
            if( target.checked ){
                this.checkboxes.push( target.value );
            } else {
                index = this.checkboxes.indexOf(target.value);
                this.checkboxes.splice(index,1);
                if(this.checkboxes.length == 0){
                    this.state.survey.feedback.map((val, i) => {
                        if(item.questionId == val.questionId){
                            index = i;
                        }
                    });
                    this.state.survey.feedback.splice(index,1);
                }
            }
            if(!index){
                const feedback = target.type == 'checkbox' ? this.checkboxes.join(',') : target.value;
                this.addFeedback(item.questionId, feedback);
            }
        } else if(target.type == 'text'){
            if(!target.value){
                this.state.survey.feedback.map((val, i) => {
                    if(item.questionId == val.questionId){
                        index = i;
                    }
                });
                this.state.survey.feedback.splice(index,1);
            } else {
                item.questionAnswers[parseInt(target.id)].displayAnswer = target.value;
                const feedback = target.type == 'checkbox' ? this.checkboxes.join(',') : target.value;
                this.addFeedback(item.questionId, feedback);
            }
        } else {
            const feedback = target.type == 'checkbox' ? this.checkboxes.join(',') : target.value;
            this.addFeedback(item.questionId, feedback);
        }
    }

    ratingOn(event) {
        var id = event.target.id.split('_')[1];
		var prefix = event.target.id.split('_')[0];
		var count = parseInt(id);
		if(event.target.classList.contains('jqhover')){
			var next = count + 1;
			for(var i=next; i<=5; i++){
                var element = document.getElementById(prefix+'_'+i);
                element.classList.remove("jqhover");
			}
		} else {
			for(var i=1; i<=count; i++){
				var element = document.getElementById(prefix+'_'+i);
                element.classList.add("jqhover");
			}
		}
    }

    ratingOff(event) {
        var prefix = event.target.id.split('_')[0];
		for(var i=1; i<=5; i++){
            var element = document.getElementById(prefix+'_'+i);
            element.classList.remove("jqhover");
		}
    }

    surveyRating(event) {
        var id = event.target.id.split('_')[1];
		var prefix = event.target.id.split('_')[0];
		var count = parseInt(id);
		if(event.target.classList.contains('active')){
			var next = count + 1;
			for(var i=next; i<=5; i++){
                var element = document.getElementById(prefix+'_'+i);
				element.classList.remove('active');
			}
		} else {
			for(var i=1; i<=count; i++){
                var element = document.getElementById(prefix+'_'+i);
				element.classList.add('active');
			}
        }
        this.addFeedback(prefix, count + 1);
    }

    render() {
    return (
        <div className="survey-modal">
            {this.state.showOverlay ? (
            <div className="survey-popup" onClick={this.closePopup.bind(this, 'close')}>
                <div className="popup-content" onClick={e => e.stopPropagation()}>
                    <button type="button" className="survey-close" data-dismiss="modal" aria-hidden="true" onClick={ this.closePopup.bind(this, 'close') }></button>
                    <h3 className="survey-heading">{this.state.survey.heading}</h3>
                    <div className="quality-options">
                        { this.state.survey.data && this.state.survey.data.length > 0 ? 
                            this.state.survey.data.map((item, index) =>{
                                return (
                                    <div className="quality" key={index}>
                                        <span className="question">{item.question}</span>
                                        <div className="answer">
                                            { item.displayControlName == 'rating' ? (
                                                <div className="rating" key='rating'>
                                                    { this.ratings.map((r,i)=>{
                                                        return (<a key={'star_'+r} className="star" id={item.questionId+'_'+r} onMouseEnter={this.ratingOn}
                                                        onMouseLeave={this.ratingOff} onClick={this.surveyRating.bind(this)}/>)
                                                    })}
                                                </div>
                                            ) : item.displayControlName == 'checkbox' ? (
                                                <div className="options" key='checkbox'>
                                                    {item.questionAnswers.map((answer,j)=>{
                                                        return (<VVCheckBox key={'check_'+j} config={{ value : answer.displayAnswer, name:"checksurvey", id: item.questionId+'_'+'check_'+j,
                                                        data: item, defaultChecked : answer.defaultSelected, onChange : this.surveySelect.bind(this,item)}}/>)
                                                    })}
                                                </div>
                                            ) : 
                                            item.displayControlName == 'radiobutton' ? (
                                                <div className="options" key='radio'>
                                                    {item.questionAnswers.map((answer,k)=>{
                                                        return (<VVRadioButton key={'radio_'+k} config={{ value : answer.displayAnswer, name: "radiosurvey", id: item.questionId+'_'+'radio_'+k,
                                                        data: item, defaultChecked : answer.defaultSelected, onChange : this.surveySelect.bind(this,item)}}/>)
                                                    })}
                                                </div>
                                            ) : 
                                            item.displayControlName == 'textbox' ? (
                                            <div className="options" key='text'>
                                                {item.questionAnswers.map((answer,l)=>{
                                                    return (<input key={'text_'+l} id={l} className="form-control textbox" type='text' defaultValue={answer.displayAnswer} onChange={this.surveySelect.bind(this,item)}/>)
                                                })}
                                            </div>) : ('')}
                                        </div> 
                                    </div>
                                )
                            })
                            : ('')
                        }
                    </div>
                    <div className="submission">
                        <button type="button" className="survey-submit" onClick={this.closePopup.bind(this, 'submit')} disabled={this.state.disableSubmit}>Submit</button>
                    </div>
                </div>
            </div>):('')}
        </div>
    )
}

}
export default SurveyModal;
