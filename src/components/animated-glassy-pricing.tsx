"use client";

import React, { useRef, useEffect, useState } from "react";
import { RippleButton } from "@/components/multi-type-ripple-buttons";
import { cn } from "@/lib/utils";
import { HERO_PRISM_GRADIENT } from "@/lib/hero-gradient";

export { HERO_PRISM_GRADIENT };

/** Лёгкий фон для glass-карточек в светлой секции */
function LightGlassBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[1.75rem]"
      aria-hidden
    >
      <div className="absolute -left-[10%] top-[12%] h-[58%] w-[46%] rounded-full bg-[radial-gradient(circle,rgba(102,179,255,0.42)_0%,rgba(102,179,255,0)_68%)] blur-2xl" />
      <div className="absolute -right-[6%] top-[6%] h-[52%] w-[40%] rounded-full bg-[radial-gradient(circle,rgba(46,120,255,0.3)_0%,rgba(46,120,255,0)_70%)] blur-2xl" />
      <div className="absolute bottom-[-4%] left-[22%] h-[50%] w-[56%] rounded-full bg-[radial-gradient(circle,rgba(102,179,255,0.2)_0%,transparent_72%)] blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(46,120,255,0.14) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
    </div>
  );
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

type ShaderCanvasProps = {
  contained?: boolean;
  /** Корректирует UV, чтобы круг в шейдере не сплющивался в широком контейнере */
  circular?: boolean;
  className?: string;
  /** RGB 0–1, по умолчанию тёмный фон секции */
  backgroundRgb?: [number, number, number];
};

const ShaderCanvas = ({
  contained = false,
  circular = false,
  className,
  backgroundRgb = [0.02, 0.04, 0.08],
}: ShaderCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glProgramRef = useRef<WebGLProgram | null>(null);
  const glBgColorLocationRef = useRef<WebGLUniformLocation | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const [backgroundColor, setBackgroundColor] = useState(backgroundRgb);

  useEffect(() => {
    setBackgroundColor(backgroundRgb);
  }, [backgroundRgb]);

  useEffect(() => {
    const gl = glRef.current;
    const program = glProgramRef.current;
    const location = glBgColorLocationRef.current;
    if (gl && program && location) {
      gl.useProgram(program);
      gl.uniform3fv(location, new Float32Array(backgroundColor));
    }
  }, [backgroundColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    glRef.current = gl;

    const vertexShaderSource = `attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;
    const fragmentShaderSource = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec3 uBackgroundColor;
      uniform float uCircular;
      mat2 rotate2d(float angle){ float c=cos(angle),s=sin(angle); return mat2(c,-s,s,c); }
      float variation(vec2 v1,vec2 v2,float strength,float speed){ return sin(dot(normalize(v1),normalize(v2))*strength+iTime*speed)/100.0; }
      vec3 paintCircle(vec2 uv,vec2 center,float rad,float width){
        vec2 diff = center-uv;
        float len = length(diff);
        len += variation(diff,vec2(0.,1.),5.,2.);
        len -= variation(diff,vec2(1.,0.),5.,2.);
        float circle = smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len);
        return vec3(circle);
      }
      float paintRing(vec2 p,float rad,float width){
        float len = length(p);
        len += variation(p,vec2(0.,1.),5.,2.);
        len -= variation(p,vec2(1.,0.),5.,2.);
        return smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len);
      }
      void main(){
        if (uCircular > 0.5) {
          float aspect = iResolution.x / max(iResolution.y, 0.001);
          vec2 p = gl_FragCoord.xy / iResolution.xy - 0.5;
          p.x *= aspect;

          float radius = 0.35;
          float mask = 0.0;
          mask += paintRing(p, radius, 0.035);
          mask += paintRing(p, radius - 0.018, 0.01);
          mask += paintRing(p, radius + 0.018, 0.005);

          vec2 v = rotate2d(iTime) * (p + 0.5);
          vec3 foregroundColor = vec3(v.x, v.y, 0.7 - v.y * v.x);
          vec3 color = mix(uBackgroundColor, foregroundColor, mask);
          color = mix(color, vec3(1.0), paintRing(p, radius, 0.003));
          gl_FragColor = vec4(color, 1.0);
          return;
        }

        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        uv.x *= 1.5; uv.x -= 0.25;
        float mask = 0.0;
        float radius = .35;
        vec2 center = vec2(.5);
        mask += paintCircle(uv,center,radius,.035).r;
        mask += paintCircle(uv,center,radius-.018,.01).r;
        mask += paintCircle(uv,center,radius+.018,.005).r;
        vec2 v=rotate2d(iTime)*uv;
        vec3 foregroundColor=vec3(v.x,v.y,.7-v.y*v.x);
        vec3 color=mix(uBackgroundColor,foregroundColor,mask);
        color=mix(color,vec3(1.),paintCircle(uv,center,radius,.003).r);
        gl_FragColor=vec4(color,1.);
      }`;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Could not create shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || "Shader compilation error");
      }
      return shader;
    };

    const program = gl.createProgram();
    if (!program) throw new Error("Could not create program");
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    glProgramRef.current = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(program, "iTime");
    const iResLoc = gl.getUniformLocation(program, "iResolution");
    const circularLoc = gl.getUniformLocation(program, "uCircular");
    glBgColorLocationRef.current = gl.getUniformLocation(program, "uBackgroundColor");
    gl.uniform3fv(glBgColorLocationRef.current, new Float32Array(backgroundColor));
    gl.uniform1f(circularLoc, circular ? 1 : 0);

    let animationFrameId: number | undefined;
    let isInView = true;
    let isPageVisible = !document.hidden;

    const stopLoop = () => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = undefined;
      }
    };

    const render = (time: number) => {
      animationFrameId = undefined;
      if (!isInView || !isPageVisible) return;
      gl.uniform1f(iTimeLoc, time * 0.001);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (animationFrameId !== undefined) return;
      animationFrameId = requestAnimationFrame(render);
    };

    const resize = () => {
      const parent = contained ? canvas.parentElement : null;
      if (contained && parent) {
        const rect = parent.getBoundingClientRect();
        const size = circular
          ? Math.max(1, Math.round(Math.min(rect.width, rect.height)))
          : Math.max(1, Math.round(Math.max(rect.width, rect.height)));
        canvas.width = circular ? size : Math.max(1, Math.round(rect.width));
        canvas.height = circular ? size : Math.max(1, Math.round(rect.height));
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = "";
        canvas.style.height = "";
      }
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };

    resize();

    const resizeObserver =
      contained && canvas.parentElement ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(canvas.parentElement!);

    const observeTarget = contained && canvas.parentElement ? canvas.parentElement : canvas;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        if (isInView && isPageVisible) startLoop();
        else stopLoop();
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(observeTarget);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      if (isInView && isPageVisible) startLoop();
      else stopLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);

    if (isInView && isPageVisible) startLoop();

    return () => {
      stopLoop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver?.disconnect();
      intersectionObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (buffer) gl.deleteBuffer(buffer);
      glRef.current = null;
      glProgramRef.current = null;
      glBgColorLocationRef.current = null;
    };
  }, [contained, circular]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "block",
        backgroundRgb[0] > 0.5 ? "bg-[#f4f7fb]" : "bg-[#050a14]",
        contained
          ? circular
            ? "absolute inset-0 h-full w-full object-cover"
            : "absolute inset-0 h-full w-full"
          : "fixed top-0 left-0 z-0 h-full w-full",
        className,
      )}
      aria-hidden
    />
  );
};

export interface PricingCardProps {
  planKey?: string;
  planName: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
  buttonHref?: string;
  isPopular?: boolean;
  popularBadge?: string;
  buttonVariant?: "primary" | "secondary";
  variant?: "light" | "dark";
  isSelected?: boolean;
  /** Позиция в ряду из трёх карточек */
  cardPosition?: "left" | "center" | "right";
  onCardSelect?: () => void;
  /** Показывать $ и /mo (для демо pricing). По умолчанию false — форматы работы */
  showDollarPrice?: boolean;
  priceSuffix?: string;
}

export const PricingCard = ({
  planName,
  description,
  price,
  features,
  buttonText,
  buttonHref,
  isPopular = false,
  popularBadge = "Рекомендуем",
  buttonVariant = "primary",
  variant = "dark",
  isSelected = false,
  cardPosition,
  onCardSelect,
  showDollarPrice = false,
  priceSuffix = "/mo",
}: PricingCardProps) => {
  const isLight = variant === "light";

  const cardClasses = cn(
    "relative flex w-full min-w-0 flex-1 flex-col rounded-2xl border px-7 py-8 text-left backdrop-blur-[14px] transition-[border-color,box-shadow,transform] duration-300",
    isLight
      ? "border-white/70 bg-white/45 shadow-[0_12px_40px_rgba(46,120,255,0.08)]"
      : "bg-gradient-to-br from-black/5 to-black/0 shadow-xl dark:from-white/10 dark:to-white/5 dark:backdrop-brightness-[0.91]",
    cardPosition && "w-full min-w-0 max-w-none flex-1 basis-0",
    cardPosition === "left" && "md:self-end",
    cardPosition === "right" && "md:self-end",
    cardPosition === "center" &&
      "z-[2] md:self-end md:-translate-y-10 md:scale-[1.05] md:py-10",
    !cardPosition && "max-w-xs",
    onCardSelect && "cursor-pointer",
    isSelected
      ? "z-10 border-[#2e78ff] ring-2 ring-[#2e78ff]/28 shadow-[0_20px_48px_rgba(46,120,255,0.22)] dark:border-[#2e78ff] dark:from-white/15 dark:to-white/8 dark:ring-[#2e78ff]/35"
      : isLight
        ? "border-black/10"
        : "border-black/10 dark:border-white/10",
  );

  const buttonClasses = cn(
    "mt-auto w-full rounded-xl border-0 py-2.5 text-[14px] font-semibold transition font-sans",
    isLight
      ? buttonVariant === "primary"
        ? "bg-[#2e78ff] text-white hover:bg-[#2569e6]"
        : "bg-[#66B3FF] text-white hover:bg-[#7abefa]"
      : buttonVariant === "primary"
        ? "bg-[#2e78ff] text-white hover:bg-[#2569e6] dark:text-white"
        : "border border-white/20 bg-white/10 text-white hover:bg-white/20",
  );

  const cta = buttonHref ? (
    <a
      href={buttonHref}
      onClick={(event) => event.stopPropagation()}
      className={cn(buttonClasses, "inline-flex items-center justify-center text-center")}
    >
      {buttonText}
    </a>
  ) : (
    <RippleButton className={buttonClasses}>{buttonText}</RippleButton>
  );

  const inner = (
    <>
      {isPopular ? (
        <div className="absolute -top-4 right-4 rounded-full bg-[#66B3FF] px-3 py-1 text-[12px] font-semibold text-white">
          {popularBadge}
        </div>
      ) : null}
      <div className="mb-3">
        <h3
          className={cn(
            "font-display font-extralight leading-[1.02] tracking-[-0.03em]",
            isLight
              ? "text-[1.75rem] text-[#0b1324] sm:text-[2rem]"
              : "text-[1.75rem] text-foreground sm:text-[2rem]",
          )}
        >
          {planName}
        </h3>
        <p className={cn("mt-2 font-sans text-[16px]", isLight ? "text-[#51617b]" : "text-foreground/70")}>
          {description}
        </p>
      </div>
      <div className="my-6 flex flex-wrap items-baseline gap-2">
        {showDollarPrice ? (
          <span
            className={cn(
              "font-display text-[2.5rem] font-extralight",
              isLight ? "text-[#0b1324]" : "text-foreground",
            )}
          >
            $
          </span>
        ) : null}
        <span
          className={cn(
            "font-display font-extralight tracking-[-0.03em]",
            isLight ? "text-[#0d1a31]" : "text-foreground",
            showDollarPrice ? "text-[2.5rem]" : "text-[1.15rem] leading-snug sm:text-[1.25rem]",
          )}
        >
          {price}
        </span>
        {showDollarPrice && priceSuffix ? (
          <span className={cn("font-sans text-[14px]", isLight ? "text-[#5a6780]" : "text-foreground/70")}>
            {priceSuffix}
          </span>
        ) : null}
      </div>
      <div className="card-divider mb-5 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.1)_50%,transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.09)_20%,rgba(255,255,255,0.22)_50%,rgba(255,255,255,0.09)_80%,transparent)]" />
      <ul
        className={cn(
          "mb-6 flex flex-col gap-2 font-sans text-[14px]",
          isLight ? "text-[#4a5a75]" : "text-foreground/90",
        )}
      >
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 shrink-0 text-[#66B3FF]" />
            {feature}
          </li>
        ))}
      </ul>
      {cta}
    </>
  );

  if (onCardSelect) {
    return (
      <article
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        onClick={onCardSelect}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onCardSelect();
          }
        }}
        className={cardClasses}
      >
        {inner}
      </article>
    );
  }

  return <div className={cardClasses}>{inner}</div>;
};

interface PricingCardsGridProps {
  plans: PricingCardProps[];
  showAnimatedBackground?: boolean;
  variant?: "light" | "dark";
  selectedKey?: string;
  onSelectCard?: (key: string) => void;
  className?: string;
}

/** Сетка карточек: variant=light — оригинальная светлая тема (glass + cyan + shader). */
export function PricingCardsGrid({
  plans,
  showAnimatedBackground,
  variant = "dark",
  selectedKey,
  onSelectCard,
  className,
}: PricingCardsGridProps) {
  const isLight = variant === "light";
  const useShader = showAnimatedBackground === true;

  const cards = plans.map((plan, index) => {
    const key = plan.planKey ?? plan.planName;
    return (
      <PricingCard
        key={key}
        {...plan}
        variant={variant}
        cardPosition={index === 0 ? "left" : index === 1 ? "center" : "right"}
        isSelected={plan.planKey != null && plan.planKey === selectedKey}
        onCardSelect={
          plan.planKey && onSelectCard ? () => onSelectCard(plan.planKey!) : plan.onCardSelect
        }
      />
    );
  });

  const cardsRow = (
    <div className="relative z-10 mx-auto grid w-full max-w-[88rem] grid-cols-1 gap-8 px-2 pb-6 pt-4 sm:px-4 md:grid-cols-3 md:items-end md:gap-7 lg:gap-10">
      {cards}
    </div>
  );

  if (isLight) {
    return (
      <div
        className={cn(
          "relative overflow-visible rounded-[1.75rem] bg-[#f4f7fb] pt-6",
          className,
        )}
      >
        <LightGlassBackdrop />
        {cardsRow}
      </div>
    );
  }

  return (
    <div className={cn("dark relative overflow-visible rounded-[1.75rem] pt-6 text-foreground", className)}>
      {useShader ? (
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[1.75rem]"
          aria-hidden
        >
          <ShaderCanvas contained backgroundRgb={[0.02, 0.05, 0.12]} />
        </div>
      ) : (
        <div
          className="hero-prism-bg pointer-events-none absolute inset-0 z-0 rounded-[1.75rem]"
          style={{ background: HERO_PRISM_GRADIENT }}
          aria-hidden
        />
      )}
      {cardsRow}
    </div>
  );
}

interface ModernPricingPageProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  plans: PricingCardProps[];
  showAnimatedBackground?: boolean;
}

export const ModernPricingPage = ({
  title,
  subtitle,
  plans,
  showAnimatedBackground = true,
}: ModernPricingPageProps) => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      {showAnimatedBackground ? <ShaderCanvas /> : null}
      <main className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-8">
        <div className="mx-auto mb-14 w-full max-w-5xl text-center">
          <h1 className="bg-gradient-to-r from-slate-900 via-cyan-500 to-blue-600 bg-clip-text font-display text-[48px] font-extralight leading-tight tracking-[-0.03em] text-transparent md:text-[64px] dark:from-white dark:via-cyan-300 dark:to-blue-400">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl font-sans text-[16px] text-foreground/80 md:text-[20px]">{subtitle}</p>
        </div>
        <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-8 md:flex-row md:gap-6">
          {plans.map((plan) => (
            <PricingCard key={plan.planName} {...plan} />
          ))}
        </div>
      </main>
    </div>
  );
};
