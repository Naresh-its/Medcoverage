import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, HeartPulse, Sliders, ArrowRight, 
  Clock, AlertTriangle, CheckCircle2, ShieldAlert
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { COVERAGE_ZONES } from '../data/coverageZones';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState('zone-east');

  const handleCheckArea = () => {
    navigate('/coverage');
  };

  return (
    <PageTransition>
      <div className="p-4 sm:p-8 lg:p-10 space-y-10 text-slate-800 max-w-5xl mx-auto w-full">

        {/* 1. Welcoming Hero Banner */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 text-left space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
              <HeartPulse className="w-3.5 h-3.5 text-blue-700" />
              Public Healthcare Access Service
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Can emergency medical care reach you in time?
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              When an emergency happens, every minute counts. MedCoverage helps families, doctors, and community leaders find out if ambulances and life-saving hospital equipment can reach patients within the critical first hour.
            </p>
          </div>

          {/* Quick Area Check Input */}
          <div className="pt-2">
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <label htmlFor="area-select" className="text-xs font-bold uppercase text-slate-500 block mb-1">
                  Choose your neighborhood to check access:
                </label>
                <select
                  id="area-select"
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {COVERAGE_ZONES.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCheckArea}
                className="self-end sm:self-auto w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2 sm:mt-5"
              >
                <span>Check Access Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 2. Clear Community Health Summary Numbers */}
        <section className="space-y-3 text-left">
          <h2 className="text-xl font-bold text-slate-900">
            Current Community Emergency Snapshot
          </h2>
          <p className="text-sm text-slate-600">
            A real-time overview of emergency response readiness across our 5 city sectors:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Safe Emergency Access</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">72%</div>
              <p className="text-xs text-slate-600 leading-snug">
                Most residents can reach emergency care within the safe 15-minute window.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Areas Facing Delays</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">2 Sectors</div>
              <p className="text-xs text-slate-600 leading-snug">
                East Corridor and North Zone lack nearby blood banks and rapid stroke scanners.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center gap-2 text-blue-700">
                <Clock className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Average Arrival Time</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">18 Minutes</div>
              <p className="text-xs text-slate-600 leading-snug">
                Slightly above the 15-minute standard. Solutions exist to reduce this.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Three Clear Primary Actions (No Clutter) */}
        <section className="space-y-4 text-left">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              What Would You Like to Do?
            </h2>
            <p className="text-sm text-slate-600">
              Select any of the options below to explore emergency care in our community:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Check Map */}
            <div className="hospital-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  1. Check Your Neighborhood
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  View an easy-to-read map showing safe areas (green) and areas with dangerous delays (red).
                </p>
              </div>

              <Link
                to="/coverage"
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>Open Coverage Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Emergency Needs */}
            <div className="hospital-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  2. Can Hospitals Treat You?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  See which hospitals actually have donor blood, stroke scanners, and trauma surgeons ready today.
                </p>
              </div>

              <Link
                to="/needs"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>Check Medical Needs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 3: Plan Solutions */}
            <div className="hospital-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  3. Test Ways to Save Lives
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  See how adding an ambulance or blood storage unit can protect 225,000 more people before spending money.
                </p>
              </div>

              <Link
                to="/what-if"
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>Plan Solutions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4. Common Question: Why Being Close Isn't Enough */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-left space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-rose-700">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">A Vital Healthcare Fact</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Why having a hospital nearby doesn't always guarantee safety
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Many people believe that if a hospital building is a 5-minute drive away, they are completely safe. In reality, different emergencies require very specific tools:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">🩸 Heavy Bleeding / Trauma</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If the clinic doesn't have donor blood (Type O-), doctors cannot perform life-saving surgery. The patient must be transferred to another hospital, losing vital time.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">🧠 Stroke</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Doctors cannot administer clot-busting medication without an immediate CT brain scan. A clinic without a working 24/7 scanner cannot safely treat a stroke.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            MedCoverage measures <strong>verified medical capabilities</strong>, not just building locations.
          </p>
        </section>

      </div>
    </PageTransition>
  );
}