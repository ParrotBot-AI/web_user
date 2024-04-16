import{H as W,_ as G}from"./HeaderBtn-n--8KyWW.js";import{r as K,a as Z,b as J,c as V,d as ee,e as te}from"./result-OKHXak3d.js";import{u as se}from"./exam-lBMaZzf2.js";import{Y as ne,k as oe,Q as j,G as H,r as T,x as A,M as ie,d as B,y as F,s as O,b as g,c as _,e as v,f,t as y,i as C,j as Q,F as $,h as w,g as E,B as z,C as R,p as ae,u as q,Z as X,m as P,X as le,o as ce}from"./index-U57YJnlT.js";import{_ as ue}from"./index.vue_vue_type_script_setup_true_lang-dty7VNrO.js";import{_ as U}from"./_plugin-vue_export-helper-x3n3nnut.js";import{_ as re,D as _e}from"./DragBox-HlYYQmos.js";import"./help-Nq3yPxnO.js";import"./index-hgE_rmLx.js";const N=ne("hearingExam",()=>{const p=oe(),n=j(),i=se(),t=H([]),a=H([]),l=T({}),o=T(!1),e=T(0),c=async s=>{const{query:h}=n;l.value={},e.value=h!=null&&h.step?Number(h==null?void 0:h.step):0;try{const[r,x]=await Promise.all([K(s),Z(s)]);l.value=r;let m=0;const L=r.questions.reduce((I,D)=>I+D.children.length,0);l.value.formatQuestion=r.questions.reduce((I,D,Pe)=>(I.push({type:"audio",voice_link:D.voice_link,question_id:D.question_id,order:m+1,title:"Please listen carefully.",url:D.voice_link,headBtns:{horn:{title:"horn",id:"horn",disabled:!1,isShow:!0},continue:{title:"CONTINUE",id:"continue",disabled:!1,isShow:!0,onClick:()=>{e.value++}}}}),D.children.forEach((S,Ae)=>{m++,S.voice_link&&I.push({type:"audio",voice_link:S.voice_link,question_id:S.question_id,order:m,title:S.question_content,url:S.voice_link,headBtns:{horn:{title:"horn",id:"horn",disabled:!0,isShow:!0},continue:{title:"CONTINUE",id:"continue",disabled:!1,isShow:!0,onClick:()=>{e.value++}}}}),I.push({...S,type:"question",order:m,headBtns:{help:{title:"HELP",id:"help",disabled:!1,isShow:!0,onClick:()=>{console.log("help"),o.value=!0}},prev:{title:"BACK",disabled:!1,id:"prev",isShow:!0,onClick:()=>{e.value>0&&e.value--}},next:{title:"NEXT",id:"next",disabled:!1,isShow:L!==m,onClick:()=>{e.value++}},submit:{title:"SUBMIT",id:"submit",disabled:!1,isShow:L===m,onClick:()=>{b()}}}})}),I),[{type:"info",headBtns:{continue:{title:"CONTINUE",id:"continue",disabled:!1,isShow:!0,onClick:()=>{o.value?o.value=!1:e.value++}}},title:"Listening",info_title:"Listening Section Directions",is_show_footer:!0,question_title:["In this section, you will be able to demonstrate your ability to understand conversations and lectures in English. The section is divided into two separately timed parts. You will hear each conversation or lecture only one time.","A clock will indicate how much time remains. The clock will count down only while you are answering questions, not while you are listening. In some questions, you",'will see this icon: <div class="listen-icon"></div> . This means that you will hear, but not see, part of the question.','You must answer each question. After you answer, select <button class="nextbtn">Next</button> . In the actual test, you cannot return to previous questions.']}]),a.length=0,a.push(...x),l.value.sumQuesLength=L}catch{p.back()}},u=()=>{e.value=e.value+1},d=A(()=>{var s,h,r,x,m;return(s=l.value)!=null&&s.formatQuestion?(p.replace({query:{...n.query,step:e.value}}),o.value?(r=(h=l.value)==null?void 0:h.formatQuestion)==null?void 0:r[0]:(m=(x=l.value)==null?void 0:x.formatQuestion)==null?void 0:m[e.value]):{}}),b=async()=>{const{query:s,meta:h}=n;if(await J(s==null?void 0:s.id),(s==null?void 0:s.type)==="mixedExam"&&(s!=null&&s.mid)&&(s!=null&&s.mid)){const r=ie(`mixedExam-${s==null?void 0:s.mid}`);await V(s==null?void 0:s.id),await ee(s==null?void 0:s.id),await i.startExam("mock_exam",r==null?void 0:r.quesid[2],r==null?void 0:r.father_sheet),p.push({name:"spokenExam",query:{type:"mixedExam",mid:r==null?void 0:r.father_sheet,name:r.resource_name,id:i.examing_data.sheet_id}});return}p.push(`/result/${s==null?void 0:s.id}?type=${h==null?void 0:h.parent}`)};return{questionData:l,showHelp:o,saveQuestion:async(s,h)=>{const{query:r}=n,x=a.findIndex(m=>m.question_id===s);a[x]={question_id:s,is_answer:!0,answer:h},await te({sheet_id:r==null?void 0:r.id,question_id:s,answer:h,duration:0})},nextQuestion:u,curQuestion:d,processData:t,answerData:a,getExamData:c,requestSubmitExam:b}}),de={class:"px-32"},pe={class:"pt-16 pb-14 text-[#475467] text-xl"},he={class:"flex-1 overflow-hidden text-wrap"},me=B({__name:"Mc",props:{question_title:{},detail:{},question_id:{},options_label:{},question_content:{},restriction:{}},setup(p){const n=N(),i=T([]),t=p;return F(()=>{var l,o;const a=(l=n==null?void 0:n.answerData)==null?void 0:l.find(e=>e.question_id===t.question_id);a!=null&&a.is_answer&&(i.value=(o=a==null?void 0:a.answer)==null?void 0:o.reduce((e,c,u)=>(c===1&&e.push(u),e),[]))}),O(()=>i.value,()=>{var o,e;i.value.length>t.restriction.rc&&i.value.shift();const a=t.options_label.map((c,u)=>Number(Object.values(i.value).includes(u))),l=(e=(o=n==null?void 0:n.answerData)==null?void 0:o.find(c=>c.question_id===t.question_id))==null?void 0:e.answer;i.value.length===t.restriction.rc&&a.toString()!==(l==null?void 0:l.toString())&&n.saveQuestion(t.question_id,a)}),(a,l)=>{const o=g("a-checkbox"),e=g("a-checkbox-group");return _(),v("div",de,[f("h2",pe,y(t.question_content),1),C(e,{value:i.value,"onUpdate:value":l[0]||(l[0]=c=>i.value=c),class:"flex flex-col"},{default:Q(()=>[(_(!0),v($,null,E(t.detail,(c,u)=>(_(),w(o,{key:u,value:u,class:"flex pb-7 text-gray-500 mycheckbox flex-row"},{default:Q(()=>[f("p",he,y(c),1)]),_:2},1032,["value"]))),128))]),_:1},8,["value"])])}}}),M=U(me,[["__scopeId","data-v-c7e5ff28"]]),Y=p=>(z("data-v-96330829"),p=p(),R(),p),ve={class:"px-32"},fe={class:"pt-16 pb-14 text-[#475467] text-xl"},xe=Y(()=>f("h2",{class:"text-gray-500 text-[16px] font-bold pb-3 pt-4"},"Answer Choices",-1)),we={class:"flex flex-wrap w-[calc(100%+20px)] -ml-[10px]"},ge=Y(()=>f("div",{class:"py-2 px-4 mt-4 bg-[#F6F6F6] text-[#475467] text-base"},"Directions: Drag your answer choices to the spaces here they belong. To remove an answer choice, click on it. To review the passage, click VIEW TEXT.",-1)),be=B({__name:"Order",props:{question_title:{},detail:{},question_id:{},options_label:{},question_content:{},answer:{}},setup(p){const n=N(),i=T([]),t=p,a=A(()=>t.detail.reduce((e,c,u)=>(e[u]=c,e),{}));F(()=>{var u;const e=(u=n==null?void 0:n.answerData)==null?void 0:u.find(d=>d.question_id===t.question_id),c=e==null?void 0:e.answer.map(d=>`${d}`);e!=null&&e.is_answer&&(i.value=c)});const l=({type:e,index:c})=>{i.value[c]=e,i.value.length===t.answer.length&&n.saveQuestion(t.question_id,i.value)},o=({index:e})=>{i.value[e]=""};return(e,c)=>(_(),v("div",ve,[f("h2",fe,y(t.question_content),1),f("div",null,[(_(!0),v($,null,E(t.answer,(u,d)=>(_(),w(re,{key:d,checked:i.value,resource:a.value,onDrop:l,onDel:o,accept:["0","1","2"],index:d},null,8,["checked","resource","index"]))),128))]),xe,f("div",we,[(_(!0),v($,null,E(t.detail,(u,d)=>(_(),w(_e,{key:d,val:u,type:`${d}`,res:i.value},null,8,["val","type","res"]))),128))]),ge]))}}),ke=U(be,[["__scopeId","data-v-96330829"]]),ye={class:"px-32"},qe={class:"pt-16 pb-14 text-[#475467] text-xl"},$e=B({__name:"Sc",props:{question_title:{},detail:{},question_id:{},options_label:{},question_content:{}},setup(p){const n=N(),i=T(-1),t=p;return O(()=>t.question_id,()=>{var l;const a=(l=n==null?void 0:n.answerData)==null?void 0:l.find(o=>o.question_id===t.question_id);if(a.is_answer){const o=(a==null?void 0:a.answer.findIndex(e=>e===1))??-1;i.value=o}else i.value=-1},{immediate:!0}),O(()=>i.value,()=>{var o;const a=t.options_label.map((e,c)=>c===i.value?1:0),l=(o=n==null?void 0:n.answerData.find(e=>e.question_id===t.question_id))==null?void 0:o.answer;i.value>-1&&a.toString()!==(l==null?void 0:l.toString())&&n.saveQuestion(t.question_id,a)}),(a,l)=>{const o=g("a-radio"),e=g("a-radio-group");return _(),v("div",ye,[f("h2",qe,y(t.question_content),1),C(e,{value:i.value,"onUpdate:value":l[0]||(l[0]=c=>i.value=c)},{default:Q(()=>[(_(!0),v($,null,E(t.detail,(c,u)=>(_(),w(o,{key:u,value:u,class:"flex pb-7 text-gray-500 myraido"},{default:Q(()=>[ae(y(t.options_label[u])+". "+y(c),1)]),_:2},1032,["value"]))),128))]),_:1},8,["value"])])}}}),Ee=U($e,[["__scopeId","data-v-13f51fac"]]),Qe=p=>(z("data-v-5b92fdc8"),p=p(),R(),p),Te={class:"px-32"},Ie={class:"pt-16 pb-8 text-[#475467] text-xl"},De=Qe(()=>f("p",{class:"bg-[#f0f0f0] text-center py-4 mb-3"},"Click in the correct box for each phrase",-1)),Se={class:"w-full my-table"},Ce={class:"my-thead"},Be=B({__name:"Tf",props:{question_title:{},detail:{},keywords:{},question_id:{},options_label:{},question_content:{}},setup(p){const n=N(),i=H([]),t=A(()=>{var o,e;return[{title:"",dataIndex:"val"},...(e=(o=a.keywords)==null?void 0:o.h)==null?void 0:e.map((c,u)=>({title:c,dataIndex:u}))]}),a=p;F(()=>{const o=n==null?void 0:n.answerData.find(e=>e.question_id===a.question_id);i.length=0,i.push(...a.detail.map((e,c)=>({val:e,checkVal:o!=null&&o.is_answer?o.answer[c]:-1})))});const l=()=>{i.every(o=>o.checkVal>-1)&&n.saveQuestion(a.question_id,i.map(o=>o.checkVal))};return(o,e)=>{const c=g("a-radio"),u=g("a-radio-group");return _(),v("div",Te,[f("h2",Ie,y(a.question_content),1),De,f("div",Se,[f("div",Ce,[(_(!0),v($,null,E(t.value,d=>(_(),v("span",{key:d.dataIndex},y(d.title),1))),128))]),(_(!0),v($,null,E(i,(d,b)=>(_(),v("div",{class:"my-trow",key:b},[f("span",null,y(d[t.value[0].dataIndex]),1),C(u,{value:d.checkVal,"onUpdate:value":k=>d.checkVal=k,onChange:l},{default:Q(()=>[(_(!0),v($,null,E(t.value.slice(1),(k,s)=>(_(),w(c,{key:s,value:s+1},null,8,["value"]))),128))]),_:2},1032,["value","onUpdate:value"])]))),128))])])}}}),Ne=U(Be,[["__scopeId","data-v-5b92fdc8"]]),Le={class:"bg-white w-full h-full"},Ue={class:"flex flex-1 justify-center items-center overflow-hidden bg-white"},He=B({__name:"QuestionItem",props:{item:{}},setup(p){const n=N(),i={Toefl_Listening_sc:Ee,Toefl_Listening_mc_2:M,Toefl_Listening_mc_3:M,Toefl_Listening_orde:ke,Toefl_Listening_tf:Ne},t=p,a=()=>{n.nextQuestion()};return(l,o)=>{var u,d,b,k,s,h,r;const e=g("BQuesTimer"),c=g("BQuesTitle");return _(),v("div",Le,[C(c,{title:t.title,index:(u=t.item)==null?void 0:u.order,length:(d=q(n).questionData)==null?void 0:d.sumQuesLength},{right:Q(()=>{var x,m;return[C(e,{times:(m=(x=q(n))==null?void 0:x.questionData)==null?void 0:m.time_remain},null,8,["times"])]}),_:1},8,["title","index","length"]),f("div",Ue,[((b=t.item)==null?void 0:b.type)==="audio"?(_(),w(ue,{key:0,ended:a,title:(k=t==null?void 0:t.item)!=null&&k.title?(s=t==null?void 0:t.item)==null?void 0:s.title:"Please listen carefully.",class:"mt-20",img:"2",url:(h=t.item)==null?void 0:h.voice_link},null,8,["title","url"])):(_(),w(le(i[(r=t.item)==null?void 0:r.question_type]),X(P({key:1},t.item)),null,16))])])}}}),Oe={class:"flex"},Ke=B({__name:"index",setup(p){const n=N(),{query:i}=j(),t=T(!0);return ce(async()=>{await n.getExamData(i.id),t.value=!1}),(a,l)=>{const o=g("a-spin"),e=g("b-header"),c=g("a-layout");return t.value?(_(),w(o,{key:0,size:"large",tip:"试题加载中...",class:"fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"})):(_(),w(c,{key:1,class:"w-full h-full flex flex-col"},{default:Q(()=>{var u,d,b,k,s,h;return[C(e,{title:((u=q(i))==null?void 0:u.name)||"模拟考试"},{right:Q(()=>{var r,x;return[f("div",Oe,[(_(!0),v($,null,E((x=(r=q(n))==null?void 0:r.curQuestion)==null?void 0:x.headBtns,(m,L)=>(_(),w(W,P(m,{key:L}),null,16))),128))])]}),_:1},8,["title"]),((b=(d=q(n))==null?void 0:d.curQuestion)==null?void 0:b.type)==="info"||(k=q(n))!=null&&k.showHelp?(_(),w(G,X(P({key:0},(s=q(n))==null?void 0:s.curQuestion)),null,16)):(_(),w(He,{key:1,item:(h=q(n))==null?void 0:h.curQuestion,title:"Listening"},null,8,["item"]))]}),_:1}))}}});export{Ke as default};
