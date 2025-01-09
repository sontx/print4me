"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-white text-gray-900 select-none">
      {/* HERO SECTION */}
      <section
        id="hero"
        className="w-full py-[6rem] bg-gradient-to-r from-blue-50 to-blue-100 text-center"
      >
        <div className="mx-auto max-w-screen-xl px-4">
          <h1 className="text-3xl sm:text-5xl font-semibold mb-4 flex justify-center gap-1 sm:gap-2 leading-none">
            <img className="h-[1.875rem] sm:h-12" src="/logo.svg" /> Maze
          </h1>
          <p className="text-xl sm:text-2xl text-blue-600 mb-6 font-semibold">
            Turn Ideas into Income
          </p>
          <p className="text-gray-700 max-w-xl mx-auto mb-8">
            Create, customize, and monetize your mazes in minutes—no design
            skills required!
          </p>
          <Button size="lg">
            <Link href="maze">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="container mx-auto w-full py-16">
        <div className="mx-auto max-w-screen-xl px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Why Use Print4Me Maze?
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>Unlimited Mazes</CardTitle>
                <CardDescription>Various shapes & sizes</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                Our generator creates unique mazes instantly.
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>Print or Share</CardTitle>
                <CardDescription>PDF or digital</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                Download high-quality prints or share online to play instantly.
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>Monetize</CardTitle>
                <CardDescription>Sell your creations</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                Package your mazes for sale or use them in puzzle books.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section
        id="testimonials"
        className="container mx-auto w-full py-16 bg-gray-50"
      >
        <div className="mx-auto max-w-screen-xl px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            What Users Say
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Testimonial 1 */}
            <Card className="border bg-white p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl font-semibold">
                  “Saves me hours!”
                </CardTitle>
                <CardDescription>— Rob M.</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                My puzzle book customers love these unique, custom mazes.
              </CardContent>
            </Card>
            {/* Testimonial 2 */}
            <Card className="border bg-white p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl font-semibold">
                  “My kids love it”
                </CardTitle>
                <CardDescription>— Karen L.</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                We print new mazes every week — it's easy and fun!
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="container mx-auto w-full py-16">
        <div className="mx-auto max-w-screen-xl px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            How It Works
          </h2>
          <div className="flex flex-col sm:flex-row sm:justify-center gap-8 text-center">
            {/* Step 1 */}
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1</div>
              <h3 className="font-semibold">Generate</h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                Pick size & difficulty.
              </p>
            </div>
            {/* Step 2 */}
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
              <h3 className="font-semibold">Customize</h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                Add text & branding.
              </p>
            </div>
            {/* Step 3 */}
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
              <h3 className="font-semibold">Print or Play</h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                Choose PDF or digital.
              </p>
            </div>
            {/* Step 4 */}
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">4</div>
              <h3 className="font-semibold">Profit</h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                Sell or share easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL-TO-ACTION SECTION */}
      <section className="container mx-auto w-full py-16 bg-white text-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Ready to Create Your Maze?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join Print4Me Maze and start generating unique puzzles today!
          </p>
          <Button size="lg">
            <Link href="maze">Get Started</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
