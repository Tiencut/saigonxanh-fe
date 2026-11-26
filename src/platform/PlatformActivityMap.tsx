import {useEffect,useRef,useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {LocateFixed} from 'lucide-react';
import type {PlatformActivity} from './activityTypes';
import {usePlatformLocation} from './PlatformLocation';
import {OSM_TILE_URL,OSM_ATTRIBUTION} from '../saigonxanh/components/mapSupport';

export function PlatformActivityMap({activities,selected,onSelect}:{activities:PlatformActivity[];selected:string|null;onSelect:(id:string)=>void}) {
 const node=useRef<HTMLDivElement>(null),map=useRef<L.Map|null>(null),layer=useRef<L.LayerGroup|null>(null);
 const lastView=useRef('');
 const {position,locate,status,chooseArea}=usePlatformLocation(),[tileError,setTileError]=useState(false);
 const selectRef=useRef(onSelect),areaRef=useRef(chooseArea);
 selectRef.current=onSelect;
 useEffect(()=>{
  if(!node.current)return;
  const instance=L.map(node.current,{maxZoom:16,minZoom:3,scrollWheelZoom:true,touchZoom:true,zoomControl:false,bounceAtZoomLimits:false,wheelDebounceTime:150,wheelPxPerZoomLevel:120,zoomAnimation:false,fadeAnimation:false}).setView([16.2,106.3],5);
  L.control.zoom({position:'bottomright'}).addTo(instance);
  L.control.scale({position:'bottomleft',imperial:false,maxWidth:100}).addTo(instance);
  map.current=instance;
  const tiles=L.tileLayer(OSM_TILE_URL,{maxZoom:16,attribution:OSM_ATTRIBUTION,updateWhenIdle:true,updateWhenZooming:false,keepBuffer:1}).addTo(instance);
  tiles.on('tileerror',()=>setTileError(true));tiles.on('tileload',()=>setTileError(false));
  layer.current=L.layerGroup().addTo(instance);
  instance.on('click',(event:L.LeafletMouseEvent)=>areaRef.current(event.latlng.lat,event.latlng.lng));
  const observer=new ResizeObserver(()=>instance.invalidateSize({pan:false}));observer.observe(node.current);
  return()=>{observer.disconnect();instance.remove();map.current=null;layer.current=null;lastView.current='';};
 },[]);
 useEffect(()=>{
  const instance=map.current,markers=layer.current;if(!instance||!markers)return;
  markers.clearLayers();
  if(position){
   L.circleMarker([position.latitude,position.longitude],{radius:8,color:'#fff',weight:3,fillColor:'#1671df',fillOpacity:1,className:'ctx-user-position'})
    .bindTooltip(position.source==='device'?'Vị trí của bạn':'Khu vực tìm kiếm').addTo(markers);
  }
  const valid=activities.filter(item=>item.latitude!==null&&item.longitude!==null);
  activities.forEach((item,index)=>{
   if(item.latitude===null||item.longitude===null)return;
   const button=document.createElement('button');button.type='button';button.className='ctx-map-pin'+(item.id===selected?' is-selected':'');button.textContent=String(index+1);button.setAttribute('aria-label','Xem hoạt động '+item.title);button.setAttribute('aria-pressed',String(item.id===selected));button.onclick=event=>{event.stopPropagation();selectRef.current(item.id);};
   L.marker([item.latitude!,item.longitude!],{icon:L.divIcon({html:button,className:'ctx-activity-marker',iconSize:[34,42],iconAnchor:[17,36]}),bubblingMouseEvents:false}).addTo(markers);
  });
  const chosen=valid.find(item=>item.id===selected);
  const viewKey=chosen?'activity:'+chosen.id:position?'position:'+position.latitude+','+position.longitude:'overview';
  // Refreshing a list or filter must not undo the visitor's pan/zoom.
  if(viewKey!==lastView.current){
   if(chosen){instance.setView([chosen.latitude!,chosen.longitude!],15,{animate:false});lastView.current=viewKey;}
   else if(position){instance.setView([position.latitude,position.longitude],14,{animate:false});lastView.current=viewKey;}
   else if(valid.length){instance.fitBounds(L.latLngBounds(valid.map(item=>[item.latitude!,item.longitude!] as [number,number])),{padding:[35,35],maxZoom:14,animate:false});lastView.current=viewKey;}
  }
 },[activities,position,selected]);
 return <div className="ctx-nearby-map-wrap">
  <div className="ctx-nearby-map" ref={node} role="region" tabIndex={0} aria-label="Bản đồ hoạt động cộng đồng. Chọn điểm hoặc nhấn Enter để tìm quanh tâm bản đồ." onKeyDown={event=>{if(event.key==='Enter'&&event.target===node.current&&map.current){event.preventDefault();const center=map.current.getCenter();chooseArea(center.lat,center.lng);}}}/>
  <button className="ctx-map-locate" aria-label="Về vị trí hiện tại" disabled={status==='locating'} onClick={()=>{if(position&&map.current)map.current.setView([position.latitude,position.longitude],14,{animate:false});else locate();}}><LocateFixed size={20}/></button>
  <p className="ctx-map-instruction">Chọn điểm trên bản đồ để tìm quanh đây</p>
  {tileError&&<p className="ctx-map-error" role="status">Chưa tải được nền bản đồ. Bạn vẫn có thể xem danh sách hoạt động.</p>}
 </div>;
}
