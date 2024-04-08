import{_}from"./children.vue_vue_type_script_setup_true_lang-MOnAhOJe.js";import{s as h}from"./ai-gmfYEVXu.js";import{X as g,D as E,p as k,r as x,d as I,o as b,v as S,c as t,e as a,f as B,t as d,F as y,g as A,h as w,z as M}from"./index-PocizONO.js";const z="/assets/aiassistant-3mBxNB_k.png";let f=0;const N=g("ai",()=>{const n=E([]),s=k(),r=x(!1),e={toeflType:"",queryType:"",chatbotQuery:"","Main Content":"",mcq:"",problemMethod:""};return{init:async()=>{r.value||(n.push({type:"receive",name:"鹦鹉AI助教",isEnd:!1,id:"init",content:[`Hi
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
！`]}),r.value=!0)},list:n,sendMessage:async i=>{n.push({type:"send",id:f++,name:s.userInfo.name,content:i});const{clientId:c}=await h({...e,chatbotQuery:i,toeflType:"Writing",queryType:"其他问题"}),l=[],m=new EventSource(`/ai-api/v1/modelapi/assistantChatbot/${c}/`);m.onmessage=function(u){l.push(u.data.replace(/\[DONE!\]/,"")),u.data.match(/\[DONE!\]/)&&(n.push({type:"receive",id:f++,isEnd:!1,name:"鹦鹉AI助教",content:l}),m.close())}},setIsEnd:i=>{n.find(c=>c.id===i).isEnd=!0}}}),C={class:"text-[#344054] font-normal text-[14px] pb-1"},D={key:0,class:"py-[10px] px-[14px] items-center text-base mt-2 inline-block"},T={key:1,class:"py-[10px] px-[14px] items-center text-base mt-2 inline-block"},q={key:1,class:"py-[10px] px-[14px] items-center text-base mt-2 inline-block"},O=I({__name:"item",props:{content:{},type:{},name:{},isEnd:{type:Boolean},id:{},onAllEnd:{type:Function}},setup(n){const s=x(1),r=N(),e=n;b(()=>{s.value=1});const o=S(()=>e.type==="receive"&&!e.isEnd?e.content.slice(0,s.value):e.content),p=()=>{s.value++,s.value>e.content.length&&(r.setIsEnd(e.id),e==null||e.onAllEnd())};return(v,i)=>(t(),a("div",{class:M(["mb-3 overflow-hidden",{"left-msg":e.type==="receive","right-msg":e.type==="send"}])},[B("h2",C,d(e.name),1),e.isEnd?(t(),a("p",q,d(e.type==="send"?o.value:o.value.join("").replaceAll(`
`,"")),1)):(t(),a(y,{key:0},[e.type==="send"?(t(),a("p",D,d(o.value),1)):(t(),a("p",T,[(t(!0),a(y,null,A(o.value,(c,l)=>(t(),w(_,{word:c,onended:p,key:l},null,8,["word"]))),128))]))],64))],2))}});export{O as _,z as a,N as u};
