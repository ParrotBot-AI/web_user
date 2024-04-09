import{_}from"./children.vue_vue_type_script_setup_true_lang-IbwtwJvm.js";import{s as h}from"./ai-77IrZRF1.js";import{Y as g,G as E,q as k,r as f,d as I,o as b,x as S,c as t,e as a,f as A,t as d,F as y,g as B,h as w,A as M}from"./index-qFNGwHMx.js";const O="/assets/aiassistant-3mBxNB_k.png";let x=0;const N=g("ai",()=>{const n=E([]),s=k(),r=f(!1),e={toeflType:"",queryType:"",chatbotQuery:"","Main Content":"",mcq:"",problemMethod:""};return{init:async()=>{r.value||(n.push({type:"receive",name:"鹦鹉AI助教",isEnd:!1,id:"init",content:[`Hi
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
！`]}),r.value=!0)},list:n,sendMessage:async i=>{n.push({type:"send",id:x++,name:s.userInfo.name,content:i});const{clientId:c}=await h({...e,chatbotQuery:i,toeflType:"Writing",queryType:"其他问题"}),l=[],m=new EventSource(`/ai-api/v1/modelapi/assistantChatbot/${c}/`);m.onmessage=function(u){l.push(u.data.replace(/\[DONE!\]/,"")),u.data.match(/\[DONE!\]/)&&(n.push({type:"receive",id:x++,isEnd:!1,name:"鹦鹉AI助教",content:l}),m.close())}},setIsEnd:i=>{n.find(c=>c.id===i).isEnd=!0}}}),q={class:"text-[#344054] font-normal text-[14px] pb-1"},C={key:0,class:"py-[10px] px-[14px] items-center text-base mt-2 inline-block"},T={key:1,class:"py-[10px] px-[14px] items-center text-base mt-2 inline-block"},D={key:1,class:"py-[10px] px-[14px] items-center text-base mt-2 inline-block"},j=I({__name:"item",props:{content:{},type:{},name:{},isEnd:{type:Boolean},id:{},onAllEnd:{type:Function}},setup(n){const s=f(1),r=N(),e=n;b(()=>{s.value=1});const o=S(()=>e.type==="receive"&&!e.isEnd?e.content.slice(0,s.value):e.content),p=()=>{s.value++,s.value>e.content.length&&(r.setIsEnd(e.id),e==null||e.onAllEnd())};return(v,i)=>(t(),a("div",{class:M(["mb-3 overflow-hidden",{"left-msg":e.type==="receive","right-msg":e.type==="send"}])},[A("h2",q,d(e.name),1),e.isEnd?(t(),a("p",D,d(e.type==="send"?o.value:o.value.join("").replaceAll(`
`,"")),1)):(t(),a(y,{key:0},[e.type==="send"?(t(),a("p",C,d(o.value),1)):(t(),a("p",T,[(t(!0),a(y,null,B(o.value,(c,l)=>(t(),w(_,{word:c,onended:p,key:l},null,8,["word"]))),128))]))],64))],2))}});export{j as _,O as a,N as u};
