import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, Clock3, Route, ChevronDown } from 'lucide-react'
import { smartSearch, createTimePlan, fetchSyllabus } from '../services/api'
import ResourceCard from '../components/ResourceCard'
import ResourceTypeFilterTabs from '../components/ResourceTypeFilterTabs'

const fields = [['topic', 'Topic'], ['level', 'Level'], ['goal', 'Goal'], ['urgency', 'Urgency']]
export default function ExplorePage() {
  const [query, setQuery] = useState('I have an exam tomorrow and I do not understand recursion')
  const [data, setData] = useState(null); const [loading, setLoading] = useState(false); const [type, setType] = useState('all')
  const [minutes, setMinutes] = useState(20); const [plan, setPlan] = useState(null); const [tree, setTree] = useState([]); const [path, setPath] = useState([])
  const runSearch = async (nextIntent) => { setLoading(true); try { setData(await smartSearch(query, nextIntent, { type })) } finally { setLoading(false) } }
  useEffect(() => { fetchSyllabus().then(x => setTree(x.children)).catch(() => {}) }, [])
  useEffect(() => { if (data) runSearch(data.intent) }, [type]) // eslint-disable-line react-hooks/exhaustive-deps
  const selectNode = async (node) => { const next = [...path, node]; setPath(next); localStorage.setItem('studymate_syllabus_path', JSON.stringify(next)); const res = await fetchSyllabus(node.id); setTree(res.children); if (!res.children.length) { setQuery(node.name); setLoading(true); try { setData(await smartSearch(node.name, { topic: node.name, level: 'Beginner', goal: 'General Learning', urgency: 'Low' }, { type: 'all' })) } finally { setLoading(false) } } }
  return <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
    <p className="eyebrow mb-2">Smart discovery</p><h1 className="font-display text-3xl sm:text-4xl font-semibold">Ask in your own words.</h1>
    <form className="mt-7 flex gap-3" onSubmit={e => { e.preventDefault(); runSearch() }}><input className="input-field" value={query} onChange={e => setQuery(e.target.value)} placeholder="What do you need to learn?"/><button className="btn-primary shrink-0" disabled={loading}><Search size={17}/>{loading ? 'Thinking…' : 'Search'}</button></form>
    {data && <><div className="mt-6"><p className="eyebrow mb-3">Understood your query as</p><div className="flex flex-wrap gap-2">{fields.map(([key, label]) => <label key={key} className="chip">{label}<select value={data.intent[key]} onChange={e => { const intent = { ...data.intent, [key]: e.target.value }; setData({ ...data, intent }); runSearch(intent) }} className="bg-transparent outline-none text-text-primary"><option>{data.intent[key]}</option>{key === 'urgency' && ['Low', 'Medium', 'High'].filter(x => x !== data.intent[key]).map(x => <option key={x}>{x}</option>)}</select><ChevronDown size={13}/></label>)}</div></div>
      <div className="mt-8 flex items-center gap-3"><SlidersHorizontal size={16} className="text-text-tertiary"/><ResourceTypeFilterTabs value={type} onChange={setType}/></div>
      <div className="grid md:grid-cols-2 gap-5 mt-7">{data.results.map(r => <ResourceCard key={r.id} resource={r}/>)}</div></>}
    <section className="mt-16 border-t border-stroke pt-12"><div className="flex items-center gap-2"><Route className="text-indigo-soft" size={19}/><h2 className="font-display text-2xl font-semibold">Time-based study plan</h2></div><div className="flex flex-wrap gap-3 mt-5"><input value={minutes} onChange={e => setMinutes(e.target.value)} type="number" min="5" className="input-field max-w-40"/><button className="btn-secondary" onClick={async () => setPlan(await createTimePlan(data?.intent.topic || 'Arrays', minutes))}><Clock3 size={16}/>Generate plan</button></div>{plan && <div className="mt-6 grid gap-3">{plan.blocks.map(block => <div key={block.activity} className="card p-5 flex flex-wrap justify-between gap-3"><div><p className="font-semibold">{block.activity}</p><p className="text-sm text-text-secondary mt-1">{block.resource ? block.resource.title : 'No resource found — browse manually'}</p></div><span className="chip">{block.minutes} min</span></div>)}</div>}</section>
    <section className="mt-16 border-t border-stroke pt-12"><h2 className="font-display text-2xl font-semibold">Browse your syllabus</h2><p className="text-sm text-text-secondary mt-2">{path.map(x => x.name).join(' → ') || 'Choose a starting point'}</p><div className="flex flex-wrap gap-3 mt-5">{tree.map(node => <button className="btn-secondary" key={node.id} onClick={() => selectNode(node)}>{node.name}</button>)}</div></section>
  </div>
}
