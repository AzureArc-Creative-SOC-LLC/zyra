/* BPC-157 & TB-500 */
import bpcFront from '../assets/images/alluvi/bpc-bpcfrontnew.jpg'
import bpcPen from '../assets/images/alluvi/bpc-bpcpen.jpg'
import bpcOpen from '../assets/images/alluvi/bpc-bpcopen.jpg'
import bpcUv from '../assets/images/alluvi/bpc-uvbpc.jpg'

/* Tirzepatide 40mg */
import tirzFront from '../assets/images/alluvi/tirzepetide-Artboard2.jpg'
import tirzCopy from '../assets/images/alluvi/tirzepetide-Artboard2copy.jpg'
import tirzOpen from '../assets/images/alluvi/tirzepetide-trizyopen.jpg'
import tirzUv from '../assets/images/alluvi/tirzepetide-trizyuv.jpg'

/* Retatrutide 20mg */
import reta20Front from '../assets/images/alluvi/retatwenty-retafront.jpeg'
import reta20A from '../assets/images/alluvi/retatwenty-Artboard4copy.jpg'
import reta20B from '../assets/images/alluvi/retatwenty-Artboard4copy3.jpg'
import reta20Uv from '../assets/images/alluvi/retatwenty-retatwentyuv.jpg'

/* Retatrutide 40mg */
import retaFront from '../assets/images/alluvi/retafourty-retafrontnew.jpg'
import retaPen from '../assets/images/alluvi/retafourty-retpen.jpg'
import retaOpen from '../assets/images/alluvi/retafourty-retaopen.jpg'
import retaUv from '../assets/images/alluvi/retafourty-retauv.jpg'

/* Glow 70mg */
import glowFront from '../assets/images/alluvi/glow-glowfrontnew.jpg'
import glowPen from '../assets/images/alluvi/glow-glowpen.jpg'
import glowOpen from '../assets/images/alluvi/glow-glowopen.jpg'
import glowUv from '../assets/images/alluvi/glow-glowuv.jpg'

/* NAD+ 1,000mg */
import nadFront from '../assets/images/alluvi/nad-nadfront.jpg'
import nadPen from '../assets/images/alluvi/nad-nadpen.jpg'
import nadOpen from '../assets/images/alluvi/nad-nadopen.jpg'
import nadUv from '../assets/images/alluvi/nad-uvnad.jpg'

export const products = [
  {
    id: 'bpc-157-tb-500',
    title: 'BPC-157 & TB-500 40mg',
    subtitle: 'Recovery & Repair Blend',
    price: '$129.00',
    image: bpcFront,
    gallery: [bpcFront, bpcPen, bpcOpen, bpcUv],
    description:
      'A precision-blended research peptide combining BPC-157 and TB-500 in a single injection. Used in studies on tissue repair, vascularization, and inflammatory pathways.',
    highlights: [
      '40mg total active peptide content per injection',
      'Lyophilized for stability — reconstitute with bacteriostatic water',
      'Independently verified ≥99% purity',
      'CoA and HPLC report available on request',
    ],
    specs: {
      'Total content': '40mg',
      Purity: '≥99%',
      Form: 'Lyophilized powder',
      Storage: '2–8°C, dry, dark',
    },
  },
  {
    id: 'tirzepatide',
    title: 'Tirzepatide 40mg',
    subtitle: 'GLP-1 / GIP Dual Agonist',
    price: '$179.00',
    image: tirzFront,
    gallery: [tirzFront, tirzCopy, tirzOpen, tirzUv],
    description:
      'Research-grade Tirzepatide supplied at 40mg for flexible study design across metabolic and weight-related research protocols.',
    highlights: [
      '40mg injection, lyophilized for stability',
      'Sealed cold-chain delivery within 24 hours',
      'Batch-tested for endotoxin levels',
      'Documentation included with every order',
    ],
    specs: {
      'Injection': '40mg',
      Purity: '≥99%',
      Form: 'Lyophilized powder',
      Storage: '−20°C long term · 2–8°C short term',
    },
  },
  {
    id: 'retatrutide-20',
    title: 'Retatrutide 20mg',
    subtitle: 'Triple Agonist Research Peptide',
    price: '$129.00',
    image: reta20Front,
    gallery: [reta20Front, reta20A, reta20B, reta20Uv],
    description:
      'Retatrutide 20mg injection for research into GLP-1, GIP, and glucagon-receptor pathways. Each injection is sealed, documented, and ships in protective packaging.',
    highlights: [
      '20mg injection',
      '≥99% purity verified by HPLC',
      'Cold-pack shipping within 24 hours of order',
      'Direct WhatsApp support for protocol questions',
    ],
    specs: {
      'Injection': '20mg',
      Purity: '≥99%',
      Form: 'Lyophilized powder',
      Storage: '−20°C long term',
    },
  },
  {
    id: 'retatrutide-40',
    title: 'Retatrutide 40mg',
    subtitle: 'Triple Agonist Research Peptide',
    price: '$219.00',
    image: retaFront,
    gallery: [retaFront, retaPen, retaOpen, retaUv],
    description:
      'Retatrutide 40mg injection for research into GLP-1, GIP, and glucagon-receptor pathways. Each injection is sealed, documented, and ships in protective packaging.',
    highlights: [
      '40mg injection',
      '≥99% purity verified by HPLC',
      'Cold-pack shipping within 24 hours of order',
      'Direct WhatsApp support for protocol questions',
    ],
    specs: {
      'Injection': '40mg',
      Purity: '≥99%',
      Form: 'Lyophilized powder',
      Storage: '−20°C long term',
    },
  },
  {
    id: 'glow',
    title: 'Glow 70mg',
    subtitle: 'Skin & Pigment Research Blend',
    price: '$89.00',
    image: glowFront,
    gallery: [glowFront, glowPen, glowOpen, glowUv],
    description:
      'Glow is a research-grade peptide blend used in skin, pigment, and dermal hydration studies. Supplied at 70mg for consistent dosing.',
    highlights: [
      '70mg injection',
      'High purity, batch verified',
      'Stable lyophilized form',
      'Tamper-evident sealed packaging',
    ],
    specs: {
      'Injection': '70mg',
      Purity: '≥99%',
      Form: 'Lyophilized powder',
      Storage: '2–8°C',
    },
  },
  {
    id: 'nad-plus-1000',
    title: 'NAD+ 1,000mg',
    subtitle: 'Cellular Energy & Longevity Research',
    price: '$139.00',
    image: nadFront,
    gallery: [nadFront, nadPen, nadOpen, nadUv],
    description:
      'NAD+ 1,000mg for research into cellular energy metabolism, mitochondrial function, and longevity pathways. High-purity lyophilized powder supplied in a sealed injection.',
    highlights: [
      '1,000mg injection',
      '≥99% purity verified by HPLC',
      'Lyophilized for stability — reconstitute with bacteriostatic water',
      'CoA available on request',
    ],
    specs: {
      'Injection': '1,000mg',
      Purity: '≥99%',
      Form: 'Lyophilized powder',
      Storage: '−20°C long term · 2–8°C short term',
    },
  },
]

export const getProductById = (id) => products.find((p) => p.id === id)
