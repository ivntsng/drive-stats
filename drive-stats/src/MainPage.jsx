import { Button } from "@/components/ui/button";

function MainPage() {
  return (
    <div>
      <div class="flex flex-col min-h-screen">
        <div class="flex-grow mt-32 mb-20"> {/* Adjusted mt-16 for larger margin-top */}
          <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
              <div class="mb-8 md:mb-0"> {/* Added margin-bottom */}
                <h1 class="block font-bold sm:text-4xl lg:text-6xl lg:leading-tight">
                  Navigate your vehicle maintenance journey effortlessly.
                </h1>
                <div class="flex mt-4"> {/* Adjusted margin-top */}
                  <Button class="inline-flex justify-center items-center gap-x-3 text-center hover:bg-green-500 border-2 text-sm lg:text-base font-medium rounded-md transition py-3 px-4">Sign Up</Button>
                  <Button class="bg-sky-600 py-3 px-5 inline-flex justify-center ml-8 items-center gap-2 rounded-md border font-medium text-white shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm">Login</Button>
                </div>
              </div>
              <div class="mt-10 relative"> {/* Adjusted mt-10 for larger margin-top */}
                <img class="w-full rounded-md" src="/assets/homepage.jpg" alt="Home page image" />
              </div>
            </div>
          </div>
        </div>
        <footer class="bg-gray-900 pb-20">
          <div class="max-w-[85rem] py-2 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <div class="col-span-full lg:col-span-1">
                <a class="flex-none text-xl font-bold text-white" href="https://drivestats.com" aria-label="Brand">DriveStats</a>
              </div>
              <div class="col-span-1">
                <h4 class="font-bold text-gray-100">Product</h4>
                <div class="mt-3 grid space-y-3">
                  <p>
                    <a class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200" href="https://tracethread.com/pricing">Support</a>
                  </p>
                  <p>
                    <a class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200" href="https://tracethread.com/pricing">Documentation</a>
                  </p>
                  <p>
                    <a class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200" href="https://tracethread.com/pricing">Bug Report</a>
                  </p>
                </div>
              </div>
              <div class="col-span-1">
                <h4 class="font-bold text-gray-100">Company</h4>
                <div class="mt-3 grid space-y-3">
                  <p>
                    <a class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200" href="https://tracethread.com/pricing">About Us</a>
                  </p>
                  <p>
                    <a class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200" href="https://tracethread.com/pricing">Careers</a>
                  </p>
                  <p>
                  <a class="inline-flex gap-x-2 text-gray-400 hover:text-gray-200" href="https://tracethread.com/pricing">Contact Us</a>
                  </p>
                </div>
              </div>
              <div class="col-span-2">
                <h4 class="font-semibold text-gray-100">Stay up to date</h4>
                <form>
                  <div class="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:gap-3 bg-white rounded-md p-2">
                    <div class="w-full">
                      <label for="hero-input" class="sr-only">Email</label>
                      <input type="text" id="hero-input" name="hero-input" class="py-3 px-4 block w-full border-transparent shadow-sm rounded-md focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="Enter your email" value=""></input>
                    </div>
                    <button type="button" class="w-full sm:w-auto whitespace-nowrap inline-flex justify-center items-center gap-x-3 text-center bg-sky-600 hover:bg-sky-700 border border-transparent text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4">Subscribe</button>
                  </div>
                </form>
              </div>
            </div>
            <div class="mt-5 sm:mt-12 grid gap-y-2 sm:gap-y-0 sm:flex sm:justify-between sm:items-center">
              <div class="flex justify-between items-center">
                <p class="text-sm text-gray-400">© 2024 Drivestats. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>

  );
}

export default MainPage;
