import { createContext, useContext, type ImgHTMLAttributes } from 'react';
import './organizationBrand.css';

export type OrganizationBrand = {
  id: string; slug: string; name: string; logoLightUrl: string; logoDarkUrl: string; iconUrl: string;
};
const Context = createContext<{organization: OrganizationBrand | null; reload: () => Promise<void>}>({organization:null,reload:async()=>{}});
export const OrganizationBrandProvider = Context.Provider;
export const useOrganizationBrand = () => useContext(Context);
export function OrganizationName() { return <>{useOrganizationBrand().organization?.name || 'Chung Tay Xanh'}</>; }
export function OrganizationLogo({variant='icon',...props}:ImgHTMLAttributes<HTMLImageElement> & {variant?:'light'|'dark'|'icon'}) {
  const {organization}=useOrganizationBrand();
  const src = variant==='icon' ? organization?.iconUrl : variant==='dark' ? organization?.logoDarkUrl : organization?.logoLightUrl;
  if (!src) return <span className={props.className} aria-label={organization?.name}>{organization?.name}</span>;
  return <img {...props} src={src} alt={props.alt ?? organization?.name ?? ''} style={{objectFit:'contain',...props.style}} />;
}
