(function(root){
'use strict';
const models=[
 {key:'e5small',name:'Multilingual E5 Small',id:'intfloat/multilingual-e5-small',dim:384,tokens:512,mode:'local',family:'e5',size:'small',multi:true,source:'https://huggingface.co/intfloat/multilingual-e5-small'},
 {key:'e5',name:'Multilingual E5 Base',id:'intfloat/multilingual-e5-base',dim:768,tokens:512,mode:'local',family:'e5',size:'medium',multi:true,source:'https://huggingface.co/intfloat/multilingual-e5-base'},
 {key:'bge',name:'BGE-M3',id:'BAAI/bge-m3',dim:1024,tokens:8192,mode:'local',family:'bge',size:'large',multi:true,source:'https://huggingface.co/BAAI/bge-m3'},
 {key:'minilm',name:'MiniLM L6',id:'sentence-transformers/all-MiniLM-L6-v2',dim:384,tokens:256,mode:'local',family:'minilm',size:'small',multi:false,source:'https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2'},
 {key:'openaismall',name:'OpenAI 3 Small',id:'text-embedding-3-small',dim:1536,tokens:8191,mode:'api',family:'openai',size:'small',multi:true,source:'https://developers.openai.com/api/docs/models/text-embedding-3-small'},
 {key:'openailarge',name:'OpenAI 3 Large',id:'text-embedding-3-large',dim:3072,tokens:8191,mode:'api',family:'openai',size:'large',multi:true,source:'https://developers.openai.com/api/docs/models/text-embedding-3-large'}
];
const defaults={language:'ar',data:'ar',task:'search',deployment:'local',hardware:'cpu',priority:'balance',privacy:'private',length:'short'};
const choices={language:['ar','en'],data:['ar','en','bi'],task:['search','retrieval','cluster'],deployment:['local','api'],hardware:['cpu','cuda','mps'],priority:['quality','balance','speed'],privacy:['private','public'],length:['short','medium','long']};
function normalize(input={}){return Object.fromEntries(Object.entries(defaults).map(([k,v])=>[k,choices[k].includes(input[k])?input[k]:v]));}
function recommend(input){const s=normalize(input);const mode=s.privacy==='private'?'local':s.deployment;const min={short:1,medium:512,long:8000}[s.length];return models.filter(m=>m.mode===mode&&(s.data==='en'||m.multi)&&m.tokens>=min).map(m=>{
 let score=0;const reasons=[];
 if(s.data!=='en'){score+=2;reasons.push('multilingual');}else if(!m.multi){score+=3;reasons.push('english');}
 if(s.privacy==='private')reasons.push('private');
 if(s.length==='long'){score+=6;reasons.push('long');}
 if(mode==='api'){score+=s.priority==='quality'?(m.size==='large'?8:2):(m.size==='small'?8:2);reasons.push(m.size==='small'?'apiSmall':'apiLarge');}
 else{if(s.hardware==='cpu'){score+=m.size==='small'?7:m.size==='medium'?3:0;if(m.size==='small')reasons.push('cpu');}
 if(s.priority==='speed'){score+=m.size==='small'?9:m.size==='medium'?3:0;if(m.size==='small')reasons.push('speed');}
 if(s.priority==='balance'){score+=m.key==='e5'?6:m.size==='small'?3:0;if(m.key==='e5')reasons.push('balance');}
 if(s.priority==='quality'){score+=m.size==='large'?8:m.size==='medium'?5:1;reasons.push('evaluate');}
 if(s.task==='cluster'&&m.family==='minilm'){score+=4;reasons.push('cluster');}
 if(s.hardware!=='cpu'&&m.size==='large'){score+=3;reasons.push('accelerator');}}
 return {...m,score,reasons:[...new Set(reasons)]};}).sort((a,b)=>b.score-a.score||a.key.localeCompare(b.key)).slice(0,3);}
function codeFor(key,framework,input){const m=models.find(x=>x.key===key);if(!m)throw Error('Unknown model');const s=normalize(input);const isCluster=s.task==='cluster';const docs=s.data==='en'?['A guide to semantic search.','Text embeddings represent meaning.']:['دليل البحث الدلالي في النصوص.','تمثل المتجهات معاني النصوص.'];const query=s.data==='en'?'How does semantic search work?':'كيف يعمل البحث الدلالي؟';const J=JSON.stringify;let install,body;
 const common=`documents = ${J(docs)}\nquery = ${J(query)}\n`;
 if(m.mode==='api'){
 if(framework==='langchain'){install='pip install langchain-openai';body=`import os\nfrom langchain_openai import OpenAIEmbeddings\n\nif not os.getenv("OPENAI_API_KEY"):\n    raise RuntimeError("Set OPENAI_API_KEY in your environment first.")\n\nembeddings = OpenAIEmbeddings(model=${J(m.id)})\n${common}\ndoc_vectors = embeddings.embed_documents(documents)\n${isCluster?'# Use doc_vectors as input to your clustering algorithm.':'query_vector = embeddings.embed_query(query)'}\nprint(len(doc_vectors), len(doc_vectors[0]))\n`;}
 else{install='pip install openai';body=`import os\nfrom openai import OpenAI\n\nif not os.getenv("OPENAI_API_KEY"):\n    raise RuntimeError("Set OPENAI_API_KEY in your environment first.")\nclient = OpenAI()\n${common}\nresponse = client.embeddings.create(model=${J(m.id)}, input=documents)\ndoc_vectors = [item.embedding for item in response.data]\n${isCluster?'# Use doc_vectors as input to your clustering algorithm.':`query_vector = client.embeddings.create(\n    model=${J(m.id)}, input=query\n).data[0].embedding`}\nprint(len(doc_vectors), len(doc_vectors[0]))\n`;}}
 else{const prefix=m.family==='e5';const dp=prefix?(isCluster?'query: ':'passage: '):'';const qp=prefix?'query: ':'';const device=s.hardware==='cuda'?'"cuda" if torch.cuda.is_available() else "cpu"':s.hardware==='mps'?'"mps" if torch.backends.mps.is_available() else "cpu"':'"cpu"';
 if(framework==='langchain'){install='pip install langchain-huggingface sentence-transformers';body=`import torch\nfrom langchain_huggingface import HuggingFaceEmbeddings\n\ndevice = ${device}\nembeddings = HuggingFaceEmbeddings(\n    model_name=${J(m.id)},\n    model_kwargs={"device": device},\n    encode_kwargs={"normalize_embeddings": True},\n)\n${common}\n# Prefixes are intentional; keep them consistent in your project.\ndoc_vectors = embeddings.embed_documents([${J(dp)} + text for text in documents])\n${isCluster?'# Use doc_vectors as input to your clustering algorithm.':`query_vector = embeddings.embed_query(${J(qp)} + query)`}\nprint(len(doc_vectors), len(doc_vectors[0]))\n`;}
 else{install='pip install sentence-transformers';body=`import torch\nfrom sentence_transformers import SentenceTransformer\n\ndevice = ${device}\nmodel = SentenceTransformer(${J(m.id)}, device=device)\n${common}\n# Prefixes are intentional; keep them consistent in your project.\ndoc_vectors = model.encode(\n    [${J(dp)} + text for text in documents], normalize_embeddings=True\n)\n${isCluster?'# Use doc_vectors as input to your clustering algorithm.':`query_vector = model.encode(${J(qp)} + query, normalize_embeddings=True)\nscores = doc_vectors @ query_vector\nprint(scores)`}\nprint(doc_vectors.shape)\n`;}}
 return {install,code:`# Khamis.AI | Python 3.10+\n# Model documentation: ${m.source}\n# Keep individual inputs below ${m.tokens} tokens; split longer documents.\n${m.mode==='api'?'# API usage sends your input to OpenAI and may incur charges.\n':'# First run downloads model weights; subsequent inference runs locally.\n'}\n${body}`};}
const api={models,defaults,normalize,recommend,codeFor};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.KhamisEngine=api;
})(typeof window!=='undefined'?window:globalThis);
