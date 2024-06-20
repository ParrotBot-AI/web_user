import{u as M,g as W,h as z,i as N,r as j,a as Q,e as H,b as J,c as k,d as C,j as V}from"./result-HIXCVlvR.js";import{Z,r as g,S as B,k as F,J as _,q as G,z as q,x as K}from"./index-uMhRcJzO.js";const ae=Z("exam",()=>{const p=g(!1),D=g(!1),o=B(),l=F();M();const c=_({allList:[],list:[],total:0,pageArr:[{start:1,end:20,id:0}]}),t=_({curQuestionIndex:1,curIndex:0,childrenLength:0,curQuestionChildrenIndex:0,time_remain:0,sheet_id:"0",questions:[],answerData:[],type:0}),m=_({read:{},hear:{},spoken:{},writing:{}}),w=g(!0),L=["read","spoken","hearing","writing"],f=g(""),I=_([]),h=G(),d=20,R=_({read:{remark:"Passage",height:184,promptText:"为适应新版托福形式变更，阅读模考需要从三篇中选择两篇.",maxSelectCount:2,minSelectCount:1},hearing:{remark:"Lecture",height:326,promptText:"为适应新版托福形式变更，听力模考section2需要选择1篇lecture",maxSelectCount:1,minSelectCount:1},spoken:{remark:"Task",height:249,promptText:"",maxSelectCount:4,minSelectCount:4},writing:{remark:["Integrated Writing","Academic discussion"],height:184,promptText:"",maxSelectCount:2,minSelectCount:2},mock:{height:249,remark:["Reading","Listening","Speaking","Writing"]}}),v=async(n,e)=>{const a=h.menuData.list,{pattern_id:s,name:r}=a.find(i=>i.key===o.name);if(e){f.value=r,c.pageArr=[];const i=await W({exam_id:1,pattern_id:s||"",limit:d,account_id:h.userInfo.account_id,page:n+1,whether_zt:!1});c.allList=o.name==="mock"?i.data[0].children:i.data,c.total=o.name==="mock"?c.allList.length:i.total,c.pageArr=new Array(Math.ceil(c.total/d)).fill(0).map((u,x)=>({start:x*d+1,end:Math.min((x+1)*d,c.total),id:x}))}c.list=c.allList.slice(n*d,(n+1)*d)},y=async(n,e,a)=>{const s=h.userInfo.account_id,r={q_type:n,question_ids:e,account_id:s};a&&(r.father_sheet=a);const i=await z(r);return t.sheet_id=i.sheet_id,i},b=async(n,e,a)=>{const s=h.userInfo.account_id;return await N({q_type:n,question_ids:e,account_id:s,father_sheet:a})},P=async(n,e)=>{try{t.curIndex=0,t.curQuestionIndex=0,t.curQuestionChildrenIndex=0,t.time_remain=0,t.sheet_id="",t.questions=[],t.answerData=[],t.type=0;const[a,s]=await Promise.all([j(n),Q(n)]);t.answerData=s.map(r=>({is_answer:r.is_answer,question_id:r.question_id,answer:r.answer})),t.sheet_id=a.sheet_id,t.childrenLength=a.questions.reduce((r,i)=>r+i.children.length,0),e?(t.curQuestionIndex=Number(o.query.sectionIndex)||0,t.curQuestionChildrenIndex=Number(o.query.quesIndex)||0,t.curIndex=a.questions.slice(0,t.curQuestionIndex).reduce((r,i)=>{var u;return r+((u=i==null?void 0:i.children)==null?void 0:u.length)||0},0)+t.curQuestionChildrenIndex):(t.curQuestionIndex=0,t.curQuestionChildrenIndex=0,t.curIndex=0),t.time_remain=a.time_remain,t.questions=a.questions,t.type=a.type}catch{l.back()}},T=n=>{let e=t.curIndex+n;const a=t.childrenLength;e<=0&&(e=0),e===a&&(e=a-1);let s=0,r=0;t.questions.forEach((i,u)=>{const x=i.children,S=s+x.length;e>=s&&e<=S&&(r=u),s=S}),t.curIndex=e,t.curQuestionIndex=r,t.curQuestionChildrenIndex=r>0?e-t.questions.slice(0,r).reduce((i,u)=>i+u.children.length,0):e,l.replace({query:{...o.query,sectionIndex:t.curQuestionIndex,quesIndex:t.curQuestionChildrenIndex}})},A=q(()=>t.curIndex===t.childrenLength-1),E=q(()=>{var e;const n=t.questions[t.curQuestionIndex];if(n&&n.question_content&&n.children.length>0){let a=0;const s=(e=n.question_content)==null?void 0:e.replace(/\$\$/g,()=>`<span class="fill-item" data-index="${a++}">【 <b></b> 】</span>`);return{...n,cur_questions_content:s.split(/\\n/)}}return{children:[],question_content:"",question_title:"",cur_questions_content:""}}),$=q(()=>{var e;const n=(e=E.value)==null?void 0:e.children[t.curQuestionChildrenIndex];return n?{...n,isShowViewText:n.question_type==="Toefl_Reading_mc"}:null});return{types:L,getExamProcess:async n=>{try{const e=await Q(n);I.length=0,I.push(...e)}catch(e){console.log(e)}},startMixedExam:b,getPastResult:async()=>{const n=h.userInfo.account_id,e=await V(n);e.听力&&e.写作&&e.口语&&e.阅读?(m.hear=e.听力,m.writing=e.写作,m.spoken=e.口语,m.read=e.阅读,w.value=!1):w.value=!0},processData:I,pastScores:m,pastScoresIsEmpty:w,setShowProcessDialog:()=>{p.value=!p.value},showAnswerHistoryDialog:D,showProcessDialog:p,getExamResource:v,exam_data:c,startExam:y,examing_data:t,changeQuestion:T,curQuestion:E,curQuestionChildren:$,getExamData:P,saveQuestion:async(n,e)=>{const a=t.answerData.findIndex(s=>s.question_id===n);t.answerData[a]={question_id:n,is_answer:!0,answer:e},await H({sheet_id:t.sheet_id,question_id:n,answer:e,duration:0})},isExamEnding:A,requestSubmitExam:async n=>{var r;await J(n);const{query:e,name:a}=o,s=K(`mixedExam-${e==null?void 0:e.mid}`);if((e==null?void 0:e.type)==="mixedExam"&&(e!=null&&e.mid)){a==="spokenExam"?(await k(n),await C(n),await y("mock_exam",s==null?void 0:s.quesid[3],s==null?void 0:s.father_sheet),l.push({name:"writingExam",query:{type:"mixedExam",mid:s==null?void 0:s.father_sheet,name:s.resource_name,id:t.sheet_id}})):a==="writingExam"&&(await k(n),await C(n),l.push(`/result/${s==null?void 0:s.father_sheet}?type=mock`));return}l.push(`/result/${n}?type=${(r=o==null?void 0:o.meta)==null?void 0:r.parent}`)},questionTitle:f,customData:R}});export{ae as u};