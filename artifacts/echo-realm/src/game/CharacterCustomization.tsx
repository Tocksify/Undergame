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
const ACCESSORY_OPTIONS: Accessory[] = Array.from(new Set(ACCESSORIES));

function Swatch({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      {...sfxProps(onClick)}
      className={`w-8 h-8 border-2 transition-transform ${
        selected ? 'border-white scale-110' : 'border-[#2a2a2a] hover:border-[#555]'
      }`}
      style={{ backgroundColor: color }}
      aria-label={color}
    />
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="cc-section-title">{title}</div>
      {children}
    </div>
  );
}

function PillBtn({
  active, disabled, onClick, children,
}: { active: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      {...sfxProps(onClick)}
      disabled={disabled}
      className={[
        'px-3 py-1 text-xs border tracking-wider transition-colors',
        active
          ? 'bg-white text-black border-white'
          : 'bg-black border-[#333] text-[#666] hover:border-[#888] hover:text-[#ccc]',
        disabled ? 'opacity-30 cursor-not-allowed' : '',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

interface Props {
  onConfirm: (appearance: SpriteAppearance) => void;
  onBack: () => void;
}

export default function CharacterCustomization({ onConfirm, onBack }: Props) {
  const [skin, setSkin]           = useState<string>(SKIN_TONES[0]);
  const [hair, setHair]           = useState<string>(HAIR_COLORS[0]);
  const [hairStyle, setHairStyle] = useState<HairStyle>('short');
  const [eye, setEye]             = useState<string>(EYE_COLORS[0]);
  const [cloth, setCloth]         = useState<string>(CLOTH_COLORS[0]);
  const [accessory, setAccessory] = useState<Accessory>('none');
  const [hat, setHat]             = useState(false);

  const confirm = () => {
    const appearance: SpriteAppearance = {
      cloth, skin, hair, hairStyle, eye,
      bodyW: 16, bodyH: 16, headSize: 12,
      accessory, hat,
    };
    onConfirm(appearance);
  };

  return (
    <div className="cc-root">
      {/* CRT overlays */}
      <div className="crt-bars"      aria-hidden="true" />
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-vignette"  aria-hidden="true" />

      <div className="cc-panel">
        <h1 className="cc-title">MAKE YOUR MARK</h1>
        <div className="menu-title-line" style={{ maxWidth: '100%', marginBottom: '0.25rem' }} />
        <p className="cc-subtitle">Choose how you'll be remembered in the Realm.</p>

        <div className="cc-body">
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
                <PillBtn key={s} active={hairStyle === s && !hat} disabled={hat} onClick={() => setHairStyle(s)}>
                  {HAIR_STYLE_LABEL[s]}
                </PillBtn>
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
                <PillBtn key={a} active={accessory === a} onClick={() => setAccessory(a)}>
                  {ACCESSORY_LABEL[a]}
                </PillBtn>
              ))}
            </div>
          </Section>

          <Section title="HAT">
            <PillBtn active={hat} onClick={() => setHat(!hat)}>
              {hat ? 'Wearing a Hat' : 'No Hat'}
            </PillBtn>
          </Section>
        </div>

        <div className="cc-divider" />

        <div className="cc-actions">
          <button className="cc-btn-back"  {...sfxProps(onBack)}>BACK</button>
          <button className="cc-btn-start" {...sfxProps(confirm)}>BEGIN JOURNEY</button>
        </div>
      </div>
    </div>
  );
}
