import React, { useState, useEffect } from 'react';
import {Link, useLocation} from "react-router-dom";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Axios from "axios";
import "./ansqst.css"
import { Icon, InlineIcon } from '@iconify/react';
import arrowUp24Filled from '@iconify/icons-fluent/arrow-up-24-filled';
import arrowDown24Filled from '@iconify/icons-fluent/arrow-down-24-filled';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function AnswerQst({match},{aboutProps}){

    const [details, setDetails] = useState([]);
    const [src,setSrc] = useState(null);
    const [answer,setAnswer] = useState("");
    const [answerid,setAnswerid] = useState();
    const [category, setCategory] = useState();
    let location = useLocation();
    const [answerClicked, setAnswerClicked] = useState(false);
    const [relQst, setRelQst] = useState();
    const [count, setCount] = useState(0);
    
    function handleAnswerClicked(){
        setAnswerClicked(true);
    }

    // if(location.state!==undefined){
    //     setCategory(location.state.category);
    // }
    

    function handleCancelClicked(){
        setAnswerClicked(false);
    }


    useEffect(() => {
        Axios.get(`http://localhost:8001/answer/${match.params.id2}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setDetails(response.data.result);
            // setSrc('http://localhost:8001/'+ response.data.image);
            console.log(response.data);
            console.log(location);
            // console.log(response.data);
        });
    }, [count]);

    useEffect(() => {
            Axios.get(`http://localhost:8001/related/${location.state.category}/${location.state.id}`, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                setRelQst(response.data.relatedquestions);
                // setSrc('http://localhost:8001/'+ response.data.image);
                // console.log(response);
                // console.log(location);
                // console.log(response.data);
            });
        }, []);
    
    

    const uploadAnswer = (e) => {
        
       
        const u = localStorage.getItem("email");
        

        fetch(`http://localhost:8001/answer/user`, {
            method: "POST",
            headers: {
                'content-type':'application/json',
                "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
                questionid:match.params.id2,
                email:u,
                answer:answer
            }),
        })
            .then((r) => {
                if (r.status == 200) {
                    alert("Answer added successfully");
                } else if (r.status == 422) alert("Invalid");
                else if (r.status == 401) alert("Authentication error");
            })
            .catch((err) => console.log(err));
        window.location.reload(false);

    };

    const voteAnswer = (id) => {
        
        console.log(id);
        const u = localStorage.getItem("email");



        fetch(`http://localhost:8001/votes/user`, {
            method: "POST",
            headers: {
                'content-type':'application/json',
                "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
                
                email:u,
                id:id
            }),
        })
            .then((r) => {
                if (r.status == 200) {
                    alert("You voted the answer");
                } else if (r.status == 403) alert("You Already Voted");
                else if (r.status == 401) alert("Authentication error");
            })
            .catch((err) => console.log(err));
        window.location.reload(false);

    };


    return (
        <div className="ansqst-main">
        <div className="row">
            <div className="col-xl-5">
            {/* <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry> */}
                

                    <div className="ansqst-qst-card" style={{width:"90%"}}>
                        <div className="ansqst-qst-card-in">
                           
                            <div className="ansqst-qst-name">
                                <div>
                                <figure className='person-icon'></figure>

                                </div>
                                {location.state===undefined?"":
                                <div>
                                    <div>{location.state.user}</div>
                                    <div style={{fontSize:10,color:"gray"}}>asked in{" "} 
                                        <span style={{color:"#06F2B0"}}>
                                        {location.state.category}
                                        </span>
                                    </div>
                                    
                                </div>}

                            </div>
                            
                            <div className="ansqst-qst">{location.state===undefined?"":location.state.question}</div>
                            {answerClicked===false?<div><button
                            className='btn start-btn col-2'
                            onClick={handleAnswerClicked}
                            type="submit"
                        >
                            Answer
                    </button></div> :<div><textarea
                            className='form-control ansqst-iin my-4'
                            type='text'
                            placeholder='Your answer'
                            name='answer'
                            onChange={(e) => {
                                setAnswer(e.target.value);
                            }}
                            required
                    ></textarea>
                    <button
                            className='btn start-btn col-3'
                            onClick={uploadAnswer}
                            type="submit"
                            style={{margin:"1vw 8vw 1vw 1vw", fontSize:"0.9rem"}}
                        >
                            Post 
                    </button>
                    <button
                            className='btn btn-outline-secondary col-3'
                            onClick={handleCancelClicked}
                            type="submit"
                            style={{margin:"1vw 0 1vw 1vw", fontSize:"0.9rem", borderRadius:"18px"}}
                        >
                            Cancel
                    </button></div>} 
                                                  
                            
                        </div>

                    </div>
                    
            <h6>Previous answers({details!==undefined?details.length:""})</h6>
            {details!==undefined?details.map((item) =>{
                return(
                    <div>
                        <div className="ansqst-ans-card">
                                <div className="qst-card-in">
                                    
                                    <div className="qst-name">
                                        <div>
                                          <figure className='person-icon'></figure>                                            
                                            
                                        </div>
                                        <div>
                                            <div>{item.answereduser}</div>
                                           
                                        </div>
                                    </div>
                                    <div className="qst-ans">
                                        {item.answer}
                                        
                                    </div>
                                </div>

                                <div className="vote-bar">
                                    <div>
                                        <button
                                            className="vote-btn"
                                            onClick={()=>{
                                                voteAnswer(item.answerid)
                                            }}
                                        >
                                            <Icon icon={arrowUp24Filled}/>
                                        </button>
                                    

                                    <span className="vote-count">{item.votes?item.votes:0}</span>
                                    
                                    
                                    {/* <Icon icon={arrowDown24Filled} /> */}
                                    </div>
                                    {/* <div>
                                        asked by <span style={{color:"#06E6B1",fontSize:12}}>{item.user}</span>
                                    </div>    */}
                                </div>

                                
                            </div>
                     
                    
                    </div>
                )
            }):""}
        </div>
        
        <div className="col-xl-7">
        <div >
            
            
                    <div>
                        <div className="relatedqst-card">
                                <div className="relatedqst-card-in">

                                    <h6 style={{marginBottom:"15px"}}>Related Questions</h6>

                                {relQst===undefined?"":
                                relQst.map((val)=>{
                                    return (<Link 
                                        className="relatedqst-link" 
                                        to={{
                                            pathname:`/index/Home/${val.questionid}`,
                                            state: {
                                                question: val.question, 
                                                user:val.user.fullname,
                                                category:val.category,
                                                id:val.questionid
                                              }
                                        }}
                                        onClick={()=>{
                                            setCount(count+1);
                                        }}
                                        
                                    >{val.question}</Link>)
                                })
                                }
                                    
                                </div>

                                
                            </div>
                     
                    
                    </div>
                
            
        </div>
        </div>
        </div>
                
            
            
            
        </div>
    );
}


export default AnswerQst;