export type PlatformActivity={id:string;title:string;location:string;startDate:string;endDate:string;status:'UPCOMING'|'ONGOING';organization:{name:string;slug:string};url:string;latitude:number|null;longitude:number|null;distanceKm:number|null;bannerImage:string|null;currentVolunteers:number;targetVolunteers:number};
export function activityImage(item:PlatformActivity){
 const src=item.bannerImage;
 if(!src)return null;
 try {const url=new URL(src,item.url);return ['https:','http:'].includes(url.protocol)?url.href:null;}catch{return null;}
}
export function formatDistance(distance:number){return distance<1?`${Math.round(distance*1000)} m`:`${distance.toLocaleString('vi-VN',{maximumFractionDigits:1})} km`;}
