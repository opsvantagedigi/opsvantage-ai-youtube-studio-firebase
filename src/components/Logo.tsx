
import Image from 'next/image';

export function Logo({ width = 50, height = 50 }: { width?: number; height?: number }) {
  return (
    <Image
      src="/opsvantage-logo.png"
      alt="OpsVantage AI-YouTube Studio Logo"
      width={width}
      height={height}
    />
  );
}

export default Logo;
