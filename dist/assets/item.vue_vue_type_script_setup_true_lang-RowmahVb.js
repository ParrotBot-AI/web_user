import{_}from"./children.vue_vue_type_script_setup_true_lang-H6bklSrB.js";import{s as h}from"./ai-fmf4TpSl.js";import{Y as E,G as g,q as k,r as x,d as I,o as b,x as S,c as s,e as i,f as A,t as d,F as y,g as B,h as w,A as M}from"./index-U57YJnlT.js";const O="/assets/aiassistant-3mBxNB_k.png";let f=0;const N=E("ai",()=>{const n=g([]),a=k(),l=x(!1),e={toeflType:"",queryType:"",chatbotQuery:"","Main Content":"",mcq:"",problemMethod:""};return{init:async()=>{l.value||(n.push({type:"receive",name:"鹦鹉AI助教",isEnd:!1,id:"init",content:[`Hi
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
！`]}),l.value=!0)},list:n,sendMessage:async r=>{n.push({type:"send",id:f++,name:a.userInfo.name,content:r});const{clientId:t}=await h({...e,chatbotQuery:r,toeflType:"Writing",queryType:"其他问题"}),o=[],m=new EventSource(`/ai-api/v1/modelapi/assistantChatbot/${t}/`);m.onmessage=function(u){o.push(u.data.replace(/\[DONE!\]/,"")),u.data.match(/\[DONE!\]/)&&(n.push({type:"receive",id:f++,isEnd:!1,name:"鹦鹉AI助教",content:o}),m.close())}},setIsEnd:r=>{const t=n.find(o=>o.id===r);t&&t.isEnd&&(t.isEnd=!0)}}}),q={class:"text-[#344054] font-normal text-[14px] pb-1"},C={key:0,class:"py-[10px] px-[14px] items-center text-base mt-2 inline-block"},T={key:1,class:"py-[10px] px-[14px] items-center text-base mt-2 inline-block"},D={key:1,class:"py-[10px] px-[14px] items-center text-base mt-2 inline-block"},j=I({__name:"item",props:{content:{},type:{},name:{},isEnd:{type:Boolean},id:{},onAllEnd:{type:Function}},setup(n){const a=x(1),l=N(),e=n;b(()=>{a.value=1});const c=S(()=>e.type==="receive"&&!e.isEnd?e.content.slice(0,a.value):e.content),p=()=>{a.value++,a.value>e.content.length&&(l.setIsEnd(e.id),e==null||e.onAllEnd())};return(v,r)=>(s(),i("div",{class:M(["mb-3 overflow-hidden",{"left-msg":e.type==="receive","right-msg":e.type==="send"}])},[A("h2",q,d(e.name),1),e.isEnd?(s(),i("p",D,d(e.type==="send"?c.value:c.value.join("").replaceAll(`
`,"")),1)):(s(),i(y,{key:0},[e.type==="send"?(s(),i("p",C,d(c.value),1)):(s(),i("p",T,[(s(!0),i(y,null,B(c.value,(t,o)=>(s(),w(_,{word:t,onended:p,key:o},null,8,["word"]))),128))]))],64))],2))}});export{j as _,O as a,N as u};
