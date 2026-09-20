import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ChevronDown,
  Headphones,
  Image as ImageIcon,
  Music2,
  Pause,
  Play,
} from 'lucide-react';

const memories = [
  ['photo-gallery-1.jpg', 'A little moment worth keeping', '-2deg'],
  ['photo-gallery-2.jpg', 'One of my favourite memories', '2deg'],
  ['photo-gallery-3.jpg', 'You probably did not know I noticed this', '-1deg'],
  ['photo-gallery-4.jpg', 'I wish I could pause this day', '3deg'],
  ['photo-gallery-5.jpg', 'A memory I still carry', '-3deg'],
  ['photo-gallery-6.jpg', 'Just us, in a little frame', '1deg'],
  ['photo-gallery-7.jpg', 'Our little fist bump — a special one', '0deg'],
];

const firstNote = [
  'I don\'t really know where to begin, because there are some things that become harder to say the longer you keep them inside.',
  'It\'s been nine months since everything between us changed. Nine months is a long time, and during all of it, I\'ve had a lot of time to think about what happened, what I did wrong, and what I should have done differently.',
  'I know I made a mistake.',
  'I should have been honest with you from the beginning. I should have told you everything myself instead of allowing you to hear about things through someone else and through videos without the complete context. Whatever my intentions were, I understand that the way everything happened hurt you and made you feel betrayed.',
  'And I\'m genuinely sorry for that.',
  'I\'m not writing this to defend myself or to prove that I was right. I\'m writing this because I finally understand that an explanation doesn\'t erase the hurt my actions caused.',
  'I wish I could go back to that time and handle everything differently. I wish I had communicated honestly, trusted our friendship enough to tell you everything, and thought about how my actions might affect you.',
  'I can\'t change those moments now.',
  'But I can admit that I was wrong.',
  'And honestly, I missed you. A lot.',
  'There were so many ordinary days when I found myself checking my phone, hoping that maybe, just maybe, there would be a message from you.',
  'Sometimes I would wait for that one notification that I knew might never come.',
  'I kept hoping that one day we\'d talk again, even if it was just a simple “hey.”',
  'Every day that passed without hearing from you reminded me of how much your presence had become a part of my everyday life.',
  'I don\'t say that to make you feel guilty. You never owed me a message.',
  'I just want you to know what those nine months felt like from my side — missing someone who had once been such an important part of my everyday life, while knowing that I was the reason things had become this way.',
  'These nine months have made me realize how much our friendship meant to me. The conversations, the silly moments, the memories, the little things that probably seemed ordinary at the time — I still value all of them.',
  'That\'s why I wanted to put some of those memories here.',
  'Not to make you feel guilty.',
  'Not to ask you for anything.',
  'And definitely not to force you to talk to me.',
  'I know you\'ve chosen distance, and I respect that.',
  'I just wanted my apology to reach you in a way that came directly from me, without anyone else explaining it for me.',
  'If you\'re angry with me, I understand.',
  'If you\'re hurt, I understand.',
  'If you don\'t feel ready to talk, I\'ll understand that too.',
  'I don\'t expect a reply, and I don\'t expect everything to suddenly become okay because I said sorry.',
  'I only hope that someday, when you think about everything that happened, you\'ll know that I truly understood my mistake and genuinely regretted hurting you.',
  'Thank you for all the memories, Batasha Ji.',
  'Thank you for the friendship we had.',
  'And most importantly—',
  'I\'m truly, genuinely sorry.',
];

function Reveal({
  children,
  className = '',
  onVisible,
}: {
  children: ReactNode;
  className?: string;
  onVisible?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          onVisible?.();
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        visible ? 'reveal is-visible ' + className : 'reveal ' + className
      }
    >
      {children}
    </div>
  );
}

function WritingParagraph({
  text,
  active,
  delay = 0,
  speed = 24,
  className = '',
}: {
  text: string;
  active: boolean;
  delay?: number;
  speed?: number;
  className?: string;
}) {
  const [written, setWritten] = useState('');
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!active) {
      setWritten('');
      setComplete(false);
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setWritten(text);
      setComplete(true);
      return;
    }

    setWritten('');
    setComplete(false);
    let index = 0;
    let interval: number | undefined;

    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1;
        setWritten(text.slice(0, index));
        if (index >= text.length) {
          if (interval) window.clearInterval(interval);
          setComplete(true);
        }
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(start);
      if (interval) window.clearInterval(interval);
    };
  }, [active, delay, speed, text]);

  return (
    <p className={'writing-line ' + className} aria-label={text}>
      {written}
      {active && !complete && <span className="writing-cursor" aria-hidden="true" />}
    </p>
  );
}

function AudioCard({
  title,
  subtitle,
  src,
  song = false,
  onPlayingChange,
}: {
  title: string;
  subtitle: string;
  src: string;
  song?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    if (!audio.current) return;
    if (playing) {
      audio.current.pause();
      setPlaying(false);
      onPlayingChange?.(false);
      return;
    }
    try {
      await audio.current.play();
      setPlaying(true);
      onPlayingChange?.(true);
    } catch {
      setPlaying(false);
      onPlayingChange?.(false);
    }
  };

  return (
    <article className={'audio-card ' + (song ? 'song ' : '') + (playing ? 'is-playing' : '')}>
      <div className="audio-icon">
        {song ? <Music2 size={20} /> : <Headphones size={20} />}
      </div>
      <div className="audio-copy">
        <span>{song ? 'a song for you' : 'voice note'}</span>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <button
        className="round-play"
        onClick={toggle}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
      </button>
      <div className="wave">
        {Array.from({ length: 14 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onEnded={() => {
          setPlaying(false);
          onPlayingChange?.(false);
        }}
      />
    </article>
  );
}

function App() {
  const ambient = useRef<HTMLAudioElement>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [opened, setOpened] = useState(false);
  const [loveWriting, setLoveWriting] = useState(false);
  const [songPlaying, setSongPlaying] = useState(false);
  const [photo, setPhoto] = useState<number | null>(null);
  const [fistBumpRevealed, setFistBumpRevealed] = useState(false);

  const toggleMusic = async () => {
    if (!ambient.current) return;
    if (musicOn) {
      ambient.current.pause();
      setMusicOn(false);
      return;
    }
    try {
      await ambient.current.play();
      setMusicOn(true);
    } catch {
      setMusicOn(false);
    }
  };

  return (
    <main className="site-shell">
      <audio ref={ambient} src="/resources/song.mp3" loop preload="metadata" />
      <div className="grain" />
      <button className="music-toggle" onClick={toggleMusic}>
        <Music2 size={14} /> {musicOn ? 'music on' : 'music'}
      </button>

      <section className="hero section-pad">
        <div className="swan-art" aria-hidden="true">
          <div className="swan-neck" />
          <div className="swan-body" />
          <div className="swan-bow">🎀</div>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">a little something, made slowly</p>
          <h1>
            For you,<em>with all my heart.</em>
          </h1>
          <p className="hero-sub">
            There are some things I could not say the right way.
            <br />
            So I made you a little place where I could try.
          </p>
          <a className="scroll-cue" href="#begin">
            open this slowly <ChevronDown size={17} />
          </a>
        </div>
      </section>

      <section id="begin" className="intro section-pad narrow">
        <Reveal>
          <div className="mini-bow">🎀</div>
          <p className="script">Before anything else...</p>
          <h2>I owe you an honest apology.</h2>
          <p className="body-copy">
            Not a rushed “sorry”. Not something typed between two notifications.
            Something I actually sat down and thought about.
          </p>
          <div className="divider">♡</div>
        </Reveal>
      </section>

      <section className="chapter apology section-pad">
        <Reveal className="chapter-heading">
          <span className="chapter-no">01</span>
          <p className="eyebrow">the first note</p>
          <h2>Dear Batasha Ji.</h2>
          <p>
            Nine months of thoughts, one honest apology, and nothing I expect
            from you in return.
          </p>
        </Reveal>
        <Reveal className="letter-stage">
          <button
            className="envelope"
            onClick={() => setOpened(!opened)}
            aria-label="Open apology letter"
          >
            <div className="envelope-body" />
            <div className={'envelope-flap ' + (opened ? 'open' : '')} />
            <div className="seal">♡</div>
            <span>{opened ? 'close the letter' : 'tap to open'}</span>
          </button>
          <article
            className={
              'paper-letter apology-paper ' + (opened ? 'paper-open' : '')
            }
          >
            <div className="paper-decoration">✿</div>
            <span className="paper-date">written from the heart · nine months later</span>
            <h3>Dear Batasha Ji,</h3>
            {firstNote.map((paragraph, index) => (
              <WritingParagraph
                key={paragraph}
                active={opened}
                text={paragraph}
                delay={index * 110}
                speed={index === 2 || index === 4 || index === 8 || index === 18 || index === 19 || index === 20 || index === 30 || index === 32 ? 42 : 22}
                className={paragraph === 'I know I made a mistake.' || paragraph === 'And I\'m genuinely sorry for that.' || paragraph === 'But I can admit that I was wrong.' || paragraph === 'And honestly, I missed you. A lot.' || paragraph === 'I\'m truly, genuinely sorry.' ? 'emphasis-line' : ''}
              />
            ))}
            <p className="hand-sign note-signature">
              <span>— Ayush</span>
            </p>
          </article>
        </Reveal>
      </section>

      <section className="between section-pad narrow">
        <Reveal>
          <div className="heart-cloud">♡</div>
          <p className="script">
            And then there is the part I am probably worse at saying...
          </p>
          <h2>how much you mean to me.</h2>
        </Reveal>
      </section>

      <section className="love section-pad">
        <Reveal className="chapter-heading">
          <span className="chapter-no">02</span>
          <p className="eyebrow">the second letter</p>
          <h2>For Batasha Ji — a second little note.</h2>
          <p>
            Separate from the apology above, this one is simply about what you mean to me.
          </p>
        </Reveal>
        <Reveal
          className="love-wrap"
          onVisible={() => setLoveWriting(true)}
        >
          <article className="paper-letter love-paper">
            <div className="paper-decoration">🎀</div>
            <span className="paper-date">a letter I wish I could hand you</span>
            <h3>Dear Batasha Ji,</h3>
            <WritingParagraph
              active={loveWriting}
              text="Somewhere along the way, you became one of those people whose little things stay with me."
              delay={150}
            />
            <WritingParagraph
              active={loveWriting}
              text="The way you smile. The tiny expressions you make. The things you say without thinking. The memories that probably look ordinary from the outside but somehow became precious to me."
              delay={500}
            />
            <WritingParagraph
              active={loveWriting}
              text="I do not need a perfect sentence to explain it. I just know that when I think about the people I want to protect, make proud, make laugh, and keep close — you are there."
              delay={900}
            />
            <WritingParagraph
              active={loveWriting}
              text="Maybe I do not always show it in the right way. Maybe sometimes I make a mess of something that was supposed to be simple. But underneath all of that, there is something very sincere:"
              delay={1250}
            />
            <WritingParagraph
              active={loveWriting}
              text="I care about you. More than I know how to put into a message."
              delay={1600}
              className="big-line"
            />
            <WritingParagraph
              active={loveWriting}
              text="And if this little website manages to say even a fraction of that, then I am glad I made it."
              delay={2050}
            />
            <p className="hand-sign">
              with all my heart,
              <br />
              <span>— Ayush ♡</span>
            </p>
          </article>
        </Reveal>
      </section>

      <section className="audio-section section-pad narrow">
        <Reveal>
          <p className="eyebrow">two little things you can hear</p>
          <h2>I wanted you to hear my voice too.</h2>
          <p className="body-copy">
            Because sometimes a typed sentence does not carry the same feeling.
          </p>
        </Reveal>
        <div className="audio-stack">
          <Reveal>
            <AudioCard
              title="Something I wanted to say"
              subtitle="A few things I could not fit into a text."
              src="/resources/voice-note-1.mp3"
            />
          </Reveal>
          <Reveal>
            <AudioCard
              title="And one more, just for you"
              subtitle="This one is a little more personal."
              src="/resources/voice-note-2.mp3"
            />
          </Reveal>
        </div>
      </section>

      <section className="song section-pad">
        <Reveal className="song-layout">
          <div className="record-wrap">
            <div className={'record ' + (songPlaying ? 'record-playing' : '')}>
              <div className="record-label">
                ♡<small>for you</small>
              </div>
            </div>
            <div className="needle" />
          </div>
          <div className="song-copy">
            <p className="eyebrow">okay, this is embarrassing</p>
            <h2>I even sang something for you.</h2>
            <p>
              I do not know if I can call myself a singer. But I know exactly
              why I wanted to sing this one.
            </p>
            <AudioCard
              title="The song I chose for you"
              subtitle="Press play. Please do not judge me too much. ♡"
              src="/resources/song.mp3"
              song
              onPlayingChange={setSongPlaying}
            />
          </div>
        </Reveal>
      </section>

      <section className="memories section-pad">
        <Reveal className="chapter-heading">
          <span className="chapter-no">03</span>
          <p className="eyebrow">our little archive</p>
          <h2>Some moments I want to keep.</h2>
          <p>
            Not every memory needs a big story. Some are special simply because
            you were there.
          </p>
        </Reveal>
        <div className="gallery">
          {memories.map((item, index) => (
            <Reveal key={item[0]} className={'gallery-item ' + (index === 6 ? 'special-memory' : '')}>
              <button
                className={'photo-card ' + (index === 6 ? 'special-photo' : '') + (index === 6 && fistBumpRevealed ? ' revealed' : '')}
                style={{ ['--rotate' as string]: item[2] }}
                onClick={() => index === 6 ? setFistBumpRevealed(true) : setPhoto(index)}
                aria-label={index === 6 ? 'Reveal the special fist bump photo' : 'Open memory'}
              >
                <div className="photo-frame">
                  {index === 6 && !fistBumpRevealed ? (
                    <div className="fist-bump-cover">
                      <div className="cover-sparkles">✦ ♡ ✦</div>
                      <span className="cover-script">a little secret memory</span>
                      <strong>tap to reveal</strong>
                      <small>for Batasha Ji ♡</small>
                    </div>
                  ) : (
                    <>
                      <img
                        src={'/resources/' + item[0]}
                        alt={index === 6 ? 'Special fist bump memory' : ''}
                        onError={e => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="photo-fallback">
                        <ImageIcon size={22} />
                        <span>your photo</span>
                      </div>
                    </>
                  )}
                </div>
                {index === 6 && <span className="special-badge">the special one ♡</span>}
                <strong>{index === 6 && !fistBumpRevealed ? 'Something special' : item[1]}</strong>
                <small>{index === 6 && !fistBumpRevealed ? 'tap to reveal the photo' : index === 6 ? 'a memory worth keeping' : 'tap to remember'}</small>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="ending section-pad narrow">
        <Reveal>
          <div className="ending-bow">🎀</div>
          <p className="script">one last thing...</p>
          <h2>I do not know what happens after this.</h2>
          <p className="body-copy">
            I do not know if a letter can fix everything. I do not know if the
            right words exist.
          </p>
          <p className="final-line">
            But I needed you to know that I am sorry.
            <br />
            And I needed you to know that I love you.
          </p>
          <div className="signature">
            Ayush <span>♡</span>
          </div>
          <div className="tiny-note">thank you for reading this slowly.</div>
        </Reveal>
      </section>

      {photo !== null && (
        <div className="photo-modal" onClick={() => setPhoto(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-photo">
              <img
                src={'/resources/' + memories[photo][0]}
                alt=""
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="photo-fallback large">
                <ImageIcon size={30} />
                <span>your memory</span>
              </div>
            </div>
            <p>{memories[photo][1]}</p>
            <button onClick={() => setPhoto(null)}>close ♡</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
