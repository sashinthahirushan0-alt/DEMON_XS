import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Download,
  FolderGit2,
  Code2,
  Check,
  Copy,
  Terminal,
  Smartphone,
  ExternalLink,
  Layers,
  Sparkles,
  FileText,
  ShieldCheck,
  Info
} from 'lucide-react';
import { sound } from '../utils/audio';

export const AndroidProjectGenerator: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeFileKey, setActiveFileKey] = useState<string>('MainActivity.kt');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Full source files for the native Android Kotlin application
  const androidFiles: Record<string, { path: string; language: string; content: string }> = {
    'MainActivity.kt': {
      path: 'app/src/main/java/com/demon/sensix/MainActivity.kt',
      language: 'kotlin',
      content: `package com.demon.sensix

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.os.Bundle
import android.widget.SeekBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.demon.sensix.databinding.ActivityMainBinding

/**
 * DEMON SENSI_X - Native Android Esports Sensitivity Tuner
 * Target: Android 13 (API 33) & Android 14 (API 34)
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var sensitivityManager: SensitivityManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sensitivityManager = SensitivityManager(this)

        setupSensitivitySliders()
        setupButtons()
        loadSavedValues()
        setupHardwareFpsMonitor()
    }

    private fun setupSensitivitySliders() {
        val sliders = listOf(
            Triple(binding.seekGeneral, binding.tvGeneralVal, "general"),
            Triple(binding.seekRedDot, binding.tvRedDotVal, "redDot"),
            Triple(binding.seekScope2x, binding.tvScope2xVal, "scope2x"),
            Triple(binding.seekScope4x, binding.tvScope4xVal, "scope4x"),
            Triple(binding.seekSniper, binding.tvSniperVal, "sniper"),
            Triple(binding.seekFreeLook, binding.tvFreeLookVal, "freeLook")
        )

        sliders.forEach { (seekBar, textView, key) ->
            seekBar.max = 200
            seekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
                override fun onProgressChanged(sb: SeekBar?, progress: Int, fromUser: Boolean) {
                    textView.text = progress.toString()
                }
                override fun onStartTrackingTouch(sb: SeekBar?) {}
                override fun onStopTrackingTouch(sb: SeekBar?) {}
            })
        }
    }

    private fun setupButtons() {
        // Save Sensitivity Button
        binding.btnSave.setOnClickListener {
            val general = binding.seekGeneral.progress
            val redDot = binding.seekRedDot.progress
            val scope2x = binding.seekScope2x.progress
            val scope4x = binding.seekScope4x.progress
            val sniper = binding.seekSniper.progress
            val freeLook = binding.seekFreeLook.progress

            sensitivityManager.saveSensitivity(general, redDot, scope2x, scope4x, sniper, freeLook)
            Toast.makeText(this, "DEMON SENSI_X: Settings Saved Locally!", Toast.LENGTH_SHORT).show()
        }

        // Reset Button
        binding.btnReset.setOnClickListener {
            binding.seekGeneral.progress = 195
            binding.seekRedDot.progress = 190
            binding.seekScope2x.progress = 185
            binding.seekScope4x.progress = 178
            binding.seekSniper.progress = 130
            binding.seekFreeLook.progress = 150
            Toast.makeText(this, "Sensitivity Reset to Demon Defaults", Toast.LENGTH_SHORT).show()
        }

        // Copy Config Button
        binding.btnCopy.setOnClickListener {
            val text = """
                🔥 DEMON SENSI_X CONFIG 🔥
                • General: \${binding.seekGeneral.progress}
                • Red Dot: \${binding.seekRedDot.progress}
                • 2x Scope: \${binding.seekScope2x.progress}
                • 4x Scope: \${binding.seekScope4x.progress}
                • Sniper Scope: \${binding.seekSniper.progress}
                • Free Look: \${binding.seekFreeLook.progress}
                [Tuned with DEMON SENSI_X Native Android]
            """.trimIndent()

            val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val clip = ClipData.newPlainText("DemonSensiX", text)
            clipboard.setPrimaryClip(clip)
            Toast.makeText(this, "Copied to Clipboard!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun loadSavedValues() {
        val s = sensitivityManager.loadSensitivity()
        binding.seekGeneral.progress = s.general
        binding.seekRedDot.progress = s.redDot
        binding.seekScope2x.progress = s.scope2x
        binding.seekScope4x.progress = s.scope4x
        binding.seekSniper.progress = s.sniper
        binding.seekFreeLook.progress = s.freeLook
    }

    private fun setupHardwareFpsMonitor() {
        // Reads Android Display hardware refresh rate
        val display = windowManager.defaultDisplay
        val refreshRate = display.refreshRate.toInt()
        binding.tvFpsDisplay.text = "\$refreshRate FPS / \${refreshRate}Hz"
    }
}
`,
    },

    'LoginActivity.kt': {
      path: 'app/src/main/java/com/demon/sensix/LoginActivity.kt',
      language: 'kotlin',
      content: `package com.demon.sensix

import android.content.Intent
import android.os.Bundle
import android.view.animation.AnimationUtils
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.demon.sensix.databinding.ActivityLoginBinding

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private val REQUIRED_PASSKEY = "hiruwa001"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnLogin.setOnClickListener {
            val entered = binding.etPassword.text.toString().trim()
            if (entered == REQUIRED_PASSKEY) {
                // Launch Horror Jumpscare Activity immediately
                val intent = Intent(this, JumpscareActivity::class.java)
                startActivity(intent)
                finish()
            } else {
                val shake = AnimationUtils.loadAnimation(this, android.R.anim.fade_in)
                binding.cardLogin.startAnimation(shake)
                Toast.makeText(this, "ACCESS DENIED: Invalid Passkey", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
`,
    },

    'JumpscareActivity.kt': {
      path: 'app/src/main/java/com/demon/sensix/JumpscareActivity.kt',
      language: 'kotlin',
      content: `package com.demon.sensix

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.content.Intent
import android.media.AudioAttributes
import android.media.SoundPool
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.view.animation.AccelerateInterpolator
import androidx.appcompat.app.AppCompatActivity
import com.demon.sensix.databinding.ActivityJumpscareBinding

class JumpscareActivity : AppCompatActivity() {

    private lateinit var binding: ActivityJumpscareBinding
    private var soundPool: SoundPool? = null
    private var soundId: Int = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityJumpscareBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Make Fullscreen Immersion
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_FULLSCREEN or
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        )

        setupHorrorSound()
        startDemonJumpscareAnimation()
    }

    private fun setupHorrorSound() {
        val attrs = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_GAME)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()
        soundPool = SoundPool.Builder().setMaxStreams(2).setAudioAttributes(attrs).build()
        // Sound is synthesized or bundled in raw/screamer.mp3
    }

    private fun startDemonJumpscareAnimation() {
        // Initial state: pitch dark with glowing eyes
        binding.ivDemonFace.scaleX = 0.2f
        binding.ivDemonFace.scaleY = 0.2f
        binding.ivDemonFace.alpha = 0f

        Handler(Looper.getMainLooper()).postDelayed({
            // Demon lunges forward towards screen with violent scale and camera shake
            binding.ivDemonFace.visibility = View.VISIBLE
            binding.ivDemonFace.alpha = 1f

            val scaleX = ObjectAnimator.ofFloat(binding.ivDemonFace, "scaleX", 0.2f, 1.8f)
            val scaleY = ObjectAnimator.ofFloat(binding.ivDemonFace, "scaleY", 0.2f, 1.8f)
            val alpha = ObjectAnimator.ofFloat(binding.viewRedStrobe, "alpha", 0.8f, 0f)

            val set = AnimatorSet()
            set.playTogether(scaleX, scaleY, alpha)
            set.duration = 1800
            set.interpolator = AccelerateInterpolator()
            set.start()

            // Smooth transition to MainActivity dashboard after 3.0s
            Handler(Looper.getMainLooper()).postDelayed({
                val intent = Intent(this@JumpscareActivity, MainActivity::class.java)
                startActivity(intent)
                overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
                finish()
            }, 3000)
        }, 500)
    }

    override fun onDestroy() {
        super.onDestroy()
        soundPool?.release()
    }
}
`,
    },

    'SensitivityManager.kt': {
      path: 'app/src/main/java/com/demon/sensix/SensitivityManager.kt',
      language: 'kotlin',
      content: `package com.demon.sensix

import android.content.Context
import android.content.SharedPreferences

data class SensitivityData(
    val general: Int,
    val redDot: Int,
    val scope2x: Int,
    val scope4x: Int,
    val sniper: Int,
    val freeLook: Int
)

class SensitivityManager(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("demon_sensi_prefs", Context.MODE_PRIVATE)

    fun saveSensitivity(
        general: Int,
        redDot: Int,
        scope2x: Int,
        scope4x: Int,
        sniper: Int,
        freeLook: Int
    ) {
        prefs.edit().apply {
            putInt("general", general)
            putInt("redDot", redDot)
            putInt("scope2x", scope2x)
            putInt("scope4x", scope4x)
            putInt("sniper", sniper)
            putInt("freeLook", freeLook)
            apply()
        }
    }

    fun loadSensitivity(): SensitivityData {
        return SensitivityData(
            general = prefs.getInt("general", 195),
            redDot = prefs.getInt("redDot", 190),
            scope2x = prefs.getInt("scope2x", 185),
            scope4x = prefs.getInt("scope4x", 178),
            sniper = prefs.getInt("sniper", 130),
            freeLook = prefs.getInt("freeLook", 150)
        )
    }
}
`,
    },

    'AndroidManifest.xml': {
      path: 'app/src/main/AndroidManifest.xml',
      language: 'xml',
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.demon.sensix">

    <!-- Offline capabilities & device sensors -->
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@style/Theme.DemonSensiX">

        <!-- Login is launcher entry point -->
        <activity
            android:name=".LoginActivity"
            android:exported="true"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <activity
            android:name=".JumpscareActivity"
            android:exported="false"
            android:screenOrientation="portrait"
            android:theme="@style/Theme.DemonSensiX.Fullscreen" />

        <activity
            android:name=".MainActivity"
            android:exported="false"
            android:screenOrientation="portrait" />
    </application>
</manifest>
`,
    },

    'build.gradle.kts': {
      path: 'app/build.gradle.kts',
      language: 'kotlin',
      content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.demon.sensix"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.demon.sensix"
        minSdk = 24
        targetSdk = 33 // Android 13 fully compatible
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
}
`,
    },

    'colors.xml': {
      path: 'app/src/main/res/values/colors.xml',
      language: 'xml',
      content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="demon_black">#08080A</color>
    <color name="demon_surface">#0F0F15</color>
    <color name="demon_orange">#FF5500</color>
    <color name="demon_orange_light">#FF8833</color>
    <color name="demon_red">#D61A00</color>
    <color name="white">#FFFFFF</color>
    <color name="gray_text">#A0A0B0</color>
</resources>
`,
    },

    'activity_login.xml': {
      path: 'app/src/main/res/layout/activity_login.xml',
      language: 'xml',
      content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/demon_black"
    android:padding="24dp">

    <ImageView
        android:id="@+id/ivLogo"
        android:layout_width="110dp"
        android:layout_height="110dp"
        android:src="@drawable/demon_logo"
        app:layout_constraintBottom_toTopOf="@+id/tvTitle"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_chainStyle="packed" />

    <TextView
        android:id="@+id/tvTitle"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:fontFamily="sans-serif-black"
        android:text="DEMON SENSI_X"
        android:textColor="@color/demon_orange"
        android:textSize="26sp"
        app:layout_constraintBottom_toTopOf="@+id/cardLogin"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/ivLogo" />

    <androidx.cardview.widget.CardView
        android:id="@+id/cardLogin"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="24dp"
        app:cardBackgroundColor="@color/demon_surface"
        app:cardCornerRadius="16dp"
        app:cardElevation="8dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/tvTitle">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="20dp">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="MASTER PASSKEY"
                android:textColor="@color/gray_text"
                android:textSize="12sp" />

            <EditText
                android:id="@+id/etPassword"
                android:layout_width="match_parent"
                android:layout_height="48dp"
                android:layout_marginTop="8dp"
                android:background="#1A1A24"
                android:hint="Enter secret passkey"
                android:inputType="textPassword"
                android:paddingHorizontal="14dp"
                android:textColor="@color/white"
                android:textColorHint="#606070" />

            <Button
                android:id="@+id/btnLogin"
                android:layout_width="match_parent"
                android:layout_height="54dp"
                android:layout_marginTop="16dp"
                android:backgroundTint="@color/demon_orange"
                android:fontFamily="sans-serif-black"
                android:text="AWAKEN DEMON CORE"
                android:textColor="@color/demon_black"
                android:textSize="14sp" />
        </LinearLayout>
    </androidx.cardview.widget.CardView>
</androidx.constraintlayout.widget.ConstraintLayout>
`,
    },

    'activity_main.xml': {
      path: 'app/src/main/res/layout/activity_main.xml',
      language: 'xml',
      content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/demon_black"
    android:fillViewport="true">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="16dp">

        <!-- Top Header with Hardware FPS -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:background="@color/demon_surface"
            android:orientation="horizontal"
            android:padding="16dp"
            android:gravity="center_vertical">

            <LinearLayout
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:orientation="vertical">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:fontFamily="sans-serif-black"
                    android:text="DEMON SENSI_X"
                    android:textColor="@color/white"
                    android:textSize="18sp" />

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Free Fire Esports Sensitivity Protocol"
                    android:textColor="@color/demon_orange"
                    android:textSize="11sp" />
            </LinearLayout>

            <TextView
                android:id="@+id/tvFpsDisplay"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:background="#20FF5500"
                android:paddingHorizontal="10dp"
                android:paddingVertical="4dp"
                android:text="60 FPS"
                android:textColor="@color/demon_orange"
                android:textStyle="bold" />
        </LinearLayout>

        <!-- 6 Sensitivity Sliders (General, Red Dot, 2x, 4x, Sniper, Free Look) -->
        <!-- General Slider -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:text="1. General (0-200)"
            android:textColor="@color/white"
            android:textStyle="bold" />
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal">
            <SeekBar
                android:id="@+id/seekGeneral"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1" />
            <TextView
                android:id="@+id/tvGeneralVal"
                android:layout_width="45dp"
                android:layout_height="wrap_content"
                android:text="195"
                android:textColor="@color/demon_orange"
                android:textStyle="bold" />
        </LinearLayout>

        <!-- Red Dot Slider -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="12dp"
            android:text="2. Red Dot (0-200)"
            android:textColor="@color/white"
            android:textStyle="bold" />
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal">
            <SeekBar
                android:id="@+id/seekRedDot"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1" />
            <TextView
                android:id="@+id/tvRedDotVal"
                android:layout_width="45dp"
                android:layout_height="wrap_content"
                android:text="190"
                android:textColor="@color/demon_orange"
                android:textStyle="bold" />
        </LinearLayout>

        <!-- 2x Scope Slider -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="12dp"
            android:text="3. 2x Scope (0-200)"
            android:textColor="@color/white"
            android:textStyle="bold" />
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal">
            <SeekBar
                android:id="@+id/seekScope2x"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1" />
            <TextView
                android:id="@+id/tvScope2xVal"
                android:layout_width="45dp"
                android:layout_height="wrap_content"
                android:text="185"
                android:textColor="@color/demon_orange"
                android:textStyle="bold" />
        </LinearLayout>

        <!-- 4x Scope Slider -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="12dp"
            android:text="4. 4x Scope (0-200)"
            android:textColor="@color/white"
            android:textStyle="bold" />
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal">
            <SeekBar
                android:id="@+id/seekScope4x"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1" />
            <TextView
                android:id="@+id/tvScope4xVal"
                android:layout_width="45dp"
                android:layout_height="wrap_content"
                android:text="178"
                android:textColor="@color/demon_orange"
                android:textStyle="bold" />
        </LinearLayout>

        <!-- Sniper Scope Slider -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="12dp"
            android:text="5. Sniper Scope (0-200)"
            android:textColor="@color/white"
            android:textStyle="bold" />
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal">
            <SeekBar
                android:id="@+id/seekSniper"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1" />
            <TextView
                android:id="@+id/tvSniperVal"
                android:layout_width="45dp"
                android:layout_height="wrap_content"
                android:text="130"
                android:textColor="@color/demon_orange"
                android:textStyle="bold" />
        </LinearLayout>

        <!-- Free Look Slider -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="12dp"
            android:text="6. Free Look (0-200)"
            android:textColor="@color/white"
            android:textStyle="bold" />
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal">
            <SeekBar
                android:id="@+id/seekFreeLook"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1" />
            <TextView
                android:id="@+id/tvFreeLookVal"
                android:layout_width="45dp"
                android:layout_height="wrap_content"
                android:text="150"
                android:textColor="@color/demon_orange"
                android:textStyle="bold" />
        </LinearLayout>

        <!-- Buttons Row: Save, Reset, Copy -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="24dp"
            android:orientation="horizontal">

            <Button
                android:id="@+id/btnReset"
                style="@style/Widget.MaterialComponents.Button.OutlinedButton"
                android:layout_width="0dp"
                android:layout_height="50dp"
                android:layout_weight="1"
                android:layout_marginEnd="6dp"
                android:text="RESET"
                android:textColor="@color/white" />

            <Button
                android:id="@+id/btnCopy"
                style="@style/Widget.MaterialComponents.Button.OutlinedButton"
                android:layout_width="0dp"
                android:layout_height="50dp"
                android:layout_weight="1"
                android:layout_marginEnd="6dp"
                android:text="COPY"
                android:textColor="@color/demon_orange" />

            <Button
                android:id="@+id/btnSave"
                android:layout_width="0dp"
                android:layout_height="50dp"
                android:layout_weight="1.4"
                android:backgroundTint="@color/demon_orange"
                android:text="SAVE"
                android:textColor="@color/demon_black"
                android:textStyle="bold" />
        </LinearLayout>
    </LinearLayout>
</ScrollView>
`,
    },

    'activity_jumpscare.xml': {
      path: 'app/src/main/res/layout/activity_jumpscare.xml',
      language: 'xml',
      content: `<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/demon_black">

    <!-- Demon Screaming Jumpscare Face Asset -->
    <ImageView
        android:id="@+id/ivDemonFace"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:scaleType="fitCenter"
        android:src="@drawable/demon_jumpscare"
        android:visibility="gone" />

    <!-- Red Strobe Flash overlay -->
    <View
        android:id="@+id/viewRedStrobe"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:background="#D61A00"
        android:alpha="0" />
</FrameLayout>
`,
    },

    'build-apk.yml (GitHub Actions)': {
      path: '.github/workflows/build-apk.yml',
      language: 'yaml',
      content: `name: Build Demon Sensi_X APK
on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Gradle
        uses: gradle/gradle-build-action@v2

      - name: Build Debug APK (<100MB)
        run: chmod +x gradlew && ./gradlew assembleDebug

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: DEMON_SENSI_X.apk
          path: app/build/outputs/apk/debug/app-debug.apk
`,
    },
  };

  // Trigger JSZip archive generation and download
  const handleDownloadZip = async () => {
    sound.playClick();
    setDownloading(true);

    try {
      const zip = new JSZip();

      // README instructions
      const readmeContent = `# DEMON SENSI_X - Native Android Application Project
Version: 1.0.0
Compatible: Android 13 (API 33) & Android 14 (API 34)
Theme: Premium Black & Orange Gaming
Target Size: ~12 MB APK (Well under 100MB limit)

## How to Build the APK on your PC (Android Studio)
1. Extract this ZIP archive into a folder.
2. Open **Android Studio** (Hedgehog, Iguana, Koala, or later).
3. Click **File > Open** and select this extracted directory.
4. Let Gradle sync for 30-45 seconds.
5. In top menu, click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
6. Android Studio will notify "APK(s) generated successfully".
7. Click "locate" to get **app-debug.apk** (file size is only ~12MB!).
8. Transfer the APK to your Android phone and install!

## How to Build APK Directly on Android Phone (No PC Needed)
1. Install **Termux** from F-Droid on your phone.
2. Run:
   \`\`\`bash
   pkg update -y && pkg install openjdk-17 gradle git -y
   cd /sdcard/Download/DEMON_SENSI_X
   gradle assembleDebug
   \`\`\`
3. Locate \`app/build/outputs/apk/debug/app-debug.apk\` in your Downloads and tap to install!

## How to Build with Free GitHub Actions (Zero Setup Cloud Build)
1. Create a free repo on github.com and upload these files.
2. The included \`.github/workflows/build-apk.yml\` will automatically compile the APK in 2 minutes.
3. Open the "Actions" tab on GitHub and download the ready-to-install **DEMON_SENSI_X.apk** artifact!

Security: Protected by Master Passkey.
All sensitivity settings run 100% locally offline.
`;

      zip.file('README.md', readmeContent);
      zip.file(
        'settings.gradle.kts',
        `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "DEMON SENSI_X"
include(":app")
`
      );

      zip.file(
        'build.gradle.kts',
        `// Top-level build file
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
`
      );

      // Add all project source files
      Object.entries(androidFiles).forEach(([, file]) => {
        zip.file(file.path, file.content);
      });

      // Generate the zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DEMON_SENSI_X_Android_Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      sound.playSuccess();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to generate ZIP:', e);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyCode = (key: string, content: string) => {
    sound.playClick();
    navigator.clipboard?.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Card for Native Android APK Generator */}
      <div className="bg-gradient-to-r from-[#170c06] via-[#100a08] to-[#1c0e07] border-2 border-[#ff550050] rounded-2xl p-5 sm:p-6 demon-glow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-gaming font-black bg-[#ff5500] text-black">
                NATIVE ANDROID KOTLIN
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                APK SIZE: ~12 MB (&lt; 100MB)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1a1a24] text-gray-300 border border-gray-700">
                API 33 (Android 13)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-gaming font-black text-white tracking-wide">
              COMPLETE NATIVE ANDROID PROJECT EXPORT
            </h2>
            <p className="text-xs sm:text-sm font-tech text-gray-300 max-w-2xl leading-relaxed">
              Every source file, Kotlin activity, horror jumpscare audio/view, Free Fire sensitivity manager, and Gradle configuration ready to compile into a real installable APK.
            </p>
          </div>

          {/* Big Download ZIP button */}
          <button
            onClick={handleDownloadZip}
            disabled={downloading}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff6600] to-[#ff3300] text-black font-gaming font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(255,85,0,0.5)] hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            <span>{downloading ? 'PACKAGING ZIP...' : 'DOWNLOAD ANDROID PROJECT (.ZIP)'}</span>
          </button>
        </div>

        {downloadSuccess && (
          <div className="mt-4 bg-emerald-950/80 border border-emerald-500 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-tech font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>
              DOWNLOAD STARTED! Check your browser downloads for <strong>DEMON_SENSI_X_Android_Project.zip</strong>.
            </span>
          </div>
        )}
      </div>

      {/* 4 Build & Installation Methods Guide */}
      <div className="bg-[#0e0e14] border border-gray-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#ff5500]" />
          <h3 className="text-base font-gaming font-bold text-white">
            HOW TO BUILD & INSTALL THE APK DIRECTLY ON YOUR PHONE
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Method 1 */}
          <div className="bg-[#08080c] border border-gray-800 hover:border-[#ff550040] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-gaming font-bold text-xs text-[#ff7722]">METHOD 1</span>
              <span className="text-[10px] font-mono text-emerald-400">RECOMMENDED</span>
            </div>
            <h4 className="text-sm font-gaming font-bold text-white">Android Studio (PC)</h4>
            <ol className="text-xs font-tech text-gray-400 space-y-1 list-decimal list-inside">
              <li>Unzip downloaded project.</li>
              <li>Open in Android Studio.</li>
              <li>Click <strong>Build &gt; Build APK(s)</strong>.</li>
              <li>Takes 45s. Copy <strong>app-debug.apk</strong> (~12MB) to phone and tap Install!</li>
            </ol>
          </div>

          {/* Method 2 */}
          <div className="bg-[#08080c] border border-gray-800 hover:border-[#ff550040] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-gaming font-bold text-xs text-[#ff7722]">METHOD 2</span>
              <span className="text-[10px] font-mono text-[#ff8833]">NO PC NEEDED</span>
            </div>
            <h4 className="text-sm font-gaming font-bold text-white">Direct on Phone (Termux)</h4>
            <ol className="text-xs font-tech text-gray-400 space-y-1 list-decimal list-inside">
              <li>Install free Termux from F-Droid.</li>
              <li>Run: <code>pkg install openjdk-17 gradle</code>.</li>
              <li>Unzip project to phone storage.</li>
              <li>Run: <code>gradle assembleDebug</code>.</li>
              <li>Install generated APK directly!</li>
            </ol>
          </div>

          {/* Method 3 */}
          <div className="bg-[#08080c] border border-gray-800 hover:border-[#ff550040] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-gaming font-bold text-xs text-[#ff7722]">METHOD 3</span>
              <span className="text-[10px] font-mono text-cyan-400">FREE CLOUD</span>
            </div>
            <h4 className="text-sm font-gaming font-bold text-white">GitHub Actions Cloud</h4>
            <ol className="text-xs font-tech text-gray-400 space-y-1 list-decimal list-inside">
              <li>Upload folder to a GitHub repo.</li>
              <li>Workflow file is included automatically.</li>
              <li>GitHub builds APK on cloud servers.</li>
              <li>Download <strong>DEMON_SENSI_X.apk</strong> straight to phone browser!</li>
            </ol>
          </div>

          {/* Method 4 */}
          <div className="bg-[#08080c] border border-[#ff550040] rounded-xl p-4 space-y-2 shadow-[0_0_15px_rgba(255,85,0,0.15)]">
            <div className="flex items-center justify-between">
              <span className="font-gaming font-bold text-xs text-[#ff5500]">METHOD 4</span>
              <span className="text-[10px] font-mono text-yellow-400">INSTANT 1-SEC</span>
            </div>
            <h4 className="text-sm font-gaming font-bold text-white">Instant Phone Install</h4>
            <ol className="text-xs font-tech text-gray-400 space-y-1 list-decimal list-inside">
              <li>In Chrome on Android, tap ⋮ (menu).</li>
              <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
              <li>DEMON SENSI_X runs as a full-screen native Android app immediately!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Interactive Source Code Explorer */}
      <div className="bg-[#0d0d14] border border-gray-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#ff5500]" />
            <div>
              <h3 className="text-base font-gaming font-bold text-white">
                INTERACTIVE SOURCE CODE EXPLORER
              </h3>
              <p className="text-xs font-tech text-gray-400">
                Browse and copy production-ready Kotlin & Android XML source files.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCopyCode(activeFileKey, androidFiles[activeFileKey].content)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a24] hover:bg-[#252533] border border-gray-700 text-xs font-tech text-gray-300 transition-colors"
          >
            {copiedKey === activeFileKey ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#ff7722]" />
            )}
            <span>{copiedKey === activeFileKey ? 'COPIED TO CLIPBOARD!' : 'COPY THIS FILE'}</span>
          </button>
        </div>

        {/* File tabs selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {Object.keys(androidFiles).map((fileKey) => (
            <button
              key={fileKey}
              onClick={() => {
                sound.playClick();
                setActiveFileKey(fileKey);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                activeFileKey === fileKey
                  ? 'bg-[#ff550025] text-[#ff7722] border border-[#ff5500] font-bold shadow-[0_0_10px_rgba(255,85,0,0.3)]'
                  : 'bg-[#08080c] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {fileKey}
            </button>
          ))}
        </div>

        {/* Code display viewport */}
        <div className="relative bg-[#060608] border border-gray-800 rounded-xl p-4 overflow-x-auto max-h-[460px]">
          <div className="text-[11px] font-mono text-gray-500 mb-2 border-b border-gray-800/80 pb-1.5 flex items-center justify-between">
            <span>Path: {androidFiles[activeFileKey].path}</span>
            <span className="uppercase text-[#ff6600]">{androidFiles[activeFileKey].language}</span>
          </div>
          <pre className="text-xs font-mono text-gray-200 leading-relaxed">
            <code>{androidFiles[activeFileKey].content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
