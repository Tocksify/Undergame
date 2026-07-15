import React, { useState } from 'react';
import { audio } from './audio';
import {
  SKIN_TONES, HAIR_COLORS, HAIR_STYLES, EYE_COLORS, ACCESSORIES, CLOTH_COLORS,
  SpriteAppearance, HairStyle, Accessory,
} from './npcAppearance';

function sfxProps(onClick?: () => void) {
  return {
    onMouseEnter: () => audio.playSfx('hover'),
    onClick: () => { audio.playSfx('click'); onClick?.(); },
  };
}

const ACCESSORY_LABEL: Record<Accessory, string> = {
  none: 'None', glasses: 'Glasses', beard: 'Beard', earrings: 'Earrings',
};
const HAIR_STYLE_LABEL: Record<HairStyle, string> = {
  bald: 'Bald', buzz: 'Buzz', short: 'Short', long: 'Long',
  ponytail: 'Ponytail', spiky: 'Spiky', mohawk: 'Mohawk',
};
// Only one entry per distinct accessory value — ACCESSORIES has 'none' repeated
// to weight NPC randomization, which isn't relevant for a manual picker.
const ACCESSORY_OPTIONS: Accessory[] = Array.from(new Set(ACCESSORIES));

function Swatch({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      {...sfxProps(onClick)}
      className={`w-8 h-8 rounded border-2 ${selected ? 'border-purple-200 scale-110' : 'border-[#3a205e]'} transition-transform`}
      style={{ backgroundColor: color }}
      aria-label={color}
    />
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-xs tracking-widest text-purple-400 mb-2">{title}</div>
      {children}
    </div>
  );
}

interface Props {
  onConfirm: (appearance: SpriteAppearance) => void;
  onBack: () => void;
}

export default function CharacterCustomization({ onConfirm, onBack }: Props) {
  const [skin, setSkin] = useState<string>(SKIN_TONES[0]);
  const [hair, setHair] = useState<string>(HAIR_COLORS[0]);
  const [hairStyle, setHairStyle] = useState<HairStyle>('short');
  const [eye, setEye] = useState<string>(EYE_COLORS[0]);
  const [cloth, setCloth] = useState<string>(CLOTH_COLORS[0]);
  const [accessory, setAccessory] = useState<Accessory>('none');
  const [hat, setHat] = useState(false);

  const confirm = () => {
    const appearance: SpriteAppearance = {
      cloth, skin, hair, hairStyle, eye,
      bodyW: 16, bodyH: 16, headSize: 12,
      accessory, hat,
    };
    onConfirm(appearance);
  };

  return (
    <div className="w-full max-w-lg bg-[#180a28] border-2 border-[#3a205e] rounded-lg p-8 font-mono text-purple-100">
      <h1 className="text-lg tracking-widest text-purple-200 mb-1">MAKE YOUR MARK</h1>
      <p className="text-xs text-purple-500 mb-6">Choose how you'll be remembered in the Realm.</p>

      <Section title="SKIN TONE">
        <div className="flex flex-wrap gap-2">
          {SKIN_TONES.map(c => <Swatch key={c} color={c} selected={skin === c} onClick={() => setSkin(c)} />)}
        </div>
      </Section>

      <Section title="HAIR COLOR">
        <div className="flex flex-wrap gap-2">
          {HAIR_COLORS.map(c => <Swatch key={c} color={c} selected={hair === c} onClick={() => setHair(c)} />)}
        </div>
      </Section>

      <Section title="HAIR STYLE">
        <div className="flex flex-wrap gap-2">
          {HAIR_STYLES.map(s => (
            <button
              key={s}
              {...sfxProps(() => setHairStyle(s))}
              disabled={hat}
              className={`px-3 py-1 text-xs rounded border ${hairStyle === s && !hat ? 'bg-purple-700 border-purple-400' : 'border-[#3a205e]'} disabled:opacity-40`}
            >
              {HAIR_STYLE_LABEL[s]}
            </button>
          ))}
        </div>
      </Section>

      <Section title="EYE COLOR">
        <div className="flex flex-wrap gap-2">
          {EYE_COLORS.map(c => <Swatch key={c} color={c} selected={eye === c} onClick={() => setEye(c)} />)}
        </div>
      </Section>

      <Section title="CLOTHING COLOR">
        <div className="flex flex-wrap gap-2">
          {CLOTH_COLORS.map(c => <Swatch key={c} color={c} selected={cloth === c} onClick={() => setCloth(c)} />)}
        </div>
      </Section>

      <Section title="ACCESSORY">
        <div className="flex flex-wrap gap-2">
          {ACCESSORY_OPTIONS.map(a => (
            <button
              key={a}
              {...sfxProps(() => setAccessory(a))}
              className={`px-3 py-1 text-xs rounded border ${accessory === a ? 'bg-purple-700 border-purple-400' : 'border-[#3a205e]'}`}
            >
              {ACCESSORY_LABEL[a]}
            </button>
          ))}
        </div>
      </Section>

      <Section title="HAT">
        <button
          {...sfxProps(() => setHat(!hat))}
          className={`px-3 py-1 text-xs rounded border ${hat ? 'bg-purple-700 border-purple-400' : 'border-[#3a205e]'}`}
        >
          {hat ? 'Wearing a Hat' : 'No Hat'}
        </button>
      </Section>

      <div className="border-t border-[#3a205e] my-6" />

      <div className="flex gap-3">
        <button
          className="flex-1 border border-[#3a205e] text-purple-400 hover:text-purple-200 rounded py-2 text-sm"
          {...sfxProps(onBack)}
        >
          Back
        </button>
        <button
          className="flex-1 bg-purple-700 hover:bg-purple-600 rounded py-2 text-sm font-bold tracking-wide"
          {...sfxProps(confirm)}
        >
          Begin Your Journey
        </button>
      </div>
    </div>
  );
}
