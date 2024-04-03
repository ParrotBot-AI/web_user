import{_ as h}from"./children.vue_vue_type_script_setup_true_lang-44rz4Pq-.js";import{X as _,Y as g,C as E,p as k,r as f,d as b,o as I,v as S,c as t,e as a,f as B,t as p,F as y,g as A,h as w,y as C}from"./index-unOnroCF.js";const j="/assets/aiassistant-3mBxNB_k.png",M="/ai-api",N=async n=>_.post(M+"/v1/modelapi/streaming/",n);let x=0;const T=g("ai",()=>{const n=E([]),s=k(),r=f(!1),e={toeflType:"",queryType:"",chatbotQuery:"","Main Content":"",mcq:"",problemMethod:""};return{init:async()=>{r.value||(n.push({type:"receive",name:"鹦鹉AI助教",isEnd:!1,id:"init",content:[`Hi
 there! 
Nice 
to 
meet 
you! 
如
果
你
对
托
福
学
习
有
任
何
问
题
都
可
以
在
这
里
向
我
提
问
！`]}),r.value=!0)},list:n,sendMessage:async i=>{n.push({type:"send",id:x++,name:s.userInfo.name,content:i});const{clientId:c}=await N({...e,chatbotQuery:i,toeflType:"Writing",queryType:"其他问题"}),l=[],m=new EventSource(`/ai-api/v1/modelapi/assistantChatbot/${c}/`);m.onmessage=function(u){l.push(u.data.replace(/\[DONE!\]/,"")),u.data.match(/\[DONE!\]/)&&(n.push({type:"receive",id:x++,isEnd:!1,name:"鹦鹉AI助教",content:l}),m.close())}},setIsEnd:i=>{n.find(c=>c.id===i).isEnd=!0}}}),q={class:"text-[#344054] font-normal text-[14px] pb-1"},D={key:0,class:"py-[10px] px-[14px] items-center text-base mt-2 inline-block"},F={key:1,class:"py-[10px] px-[14px] items-center text-base mt-2 inline-block"},P={key:1,class:"py-[10px] px-[14px] items-center text-base mt-2 inline-block"},z=b({__name:"item",props:{content:{},type:{},name:{},isEnd:{type:Boolean},id:{},onAllEnd:{type:Function}},setup(n){const s=f(1),r=T(),e=n;I(()=>{s.value=1});const o=S(()=>e.type==="receive"&&!e.isEnd?e.content.slice(0,s.value):e.content),d=()=>{s.value++,s.value>e.content.length&&(r.setIsEnd(e.id),e==null||e.onAllEnd())};return(v,i)=>(t(),a("div",{class:C(["mb-3 overflow-hidden",{"left-msg":e.type==="receive","right-msg":e.type==="send"}])},[B("h2",q,p(e.name),1),e.isEnd?(t(),a("p",P,p(e.type==="send"?o.value:o.value.join("").replaceAll(`
`,"")),1)):(t(),a(y,{key:0},[e.type==="send"?(t(),a("p",D,p(o.value),1)):(t(),a("p",F,[(t(!0),a(y,null,A(o.value,(c,l)=>(t(),w(h,{word:c,onended:d,key:l},null,8,["word"]))),128))]))],64))],2))}});export{z as _,j as a,N as s,T as u};
