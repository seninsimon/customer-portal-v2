import Image from 'next/image';
import LoginForm from '@/feature/login/login.form';

export default async function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel */}
        <div className="lg:w-1/2 bg-gradient-to-br from-[#01137e] to-[#03105b] p-8 lg:p-12 flex flex-col justify-center relative">
          <div className="relative z-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Simplify
              <br />
              shipping with
              <br />
              <span className="relative">
                our premium service.
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3"
                  viewBox="0 0 450 12"
                  fill="none"
                >
                  <path
                    d="M2 10C50 2 100 2 150 6C200 10 250 4 298 8"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-white/90 text-lg mb-12 max-w-md">
              Fast, reliable shipping for your business. Join us today.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-gray-50">
          <div className="max-w-md mx-auto w-full">
            <div className="flex items-center mb-8">
              <Image
                width={220}
                height={10}
                src="https://meridian.ociuzerp.in/media/logowhitepngwebp.webp"
                alt="Meridian EL Logo"
              />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h2>
            <p className="text-gray-500 mb-8">Please login to your account</p>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};
