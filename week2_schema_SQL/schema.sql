CREATE TABLE Arkeolog
(
  Arkeolog_ID INT NOT NULL AUTO_INCREMENT,
  Nama_Lengkap VARCHAR(255) NOT NULL,
  Afiliasi_Institusi VARCHAR(255) NOT NULL,
  Spesialisasi VARCHAR(255) NOT NULL,
  Email VARCHAR(255) NOT NULL,
  Nomor_Telepon VARCHAR(20) NOT NULL,
  PRIMARY KEY (Arkeolog_ID)
);

CREATE TABLE Kerajaan
(
  Kerajaan_ID INT NOT NULL AUTO_INCREMENT,
  Nama_Kerajaan VARCHAR(255) NOT NULL,
  Tahun_Berdiri INT,
  Tahun_Runtuh INT,
  Pusat_Pemerintahan VARCHAR(255),
  Deskripsi_Singkat TEXT NOT NULL,
  PRIMARY KEY (Kerajaan_ID)
);

CREATE TABLE Situs_Arkeologi
(
  Situs_ID INT NOT NULL AUTO_INCREMENT,
  Nama_Situs VARCHAR(255) NOT NULL,
  Jalan_Dusun VARCHAR(255) NOT NULL,
  Kecamatan VARCHAR(255) NOT NULL,
  Desa_Kelurahan VARCHAR(255) NOT NULL,
  Kota_Kabupaten VARCHAR(255) NOT NULL,
  Latitude DECIMAL(9,6) NOT NULL,
  Longitude DECIMAL(9,6) NOT NULL,
  Periode_Sejarah VARCHAR(255),
  Jenis_Situs VARCHAR(255) NOT NULL,
  Kerajaan_ID INT,
  PRIMARY KEY (Situs_ID),
  FOREIGN KEY (Kerajaan_ID) REFERENCES Kerajaan(Kerajaan_ID)
);

CREATE TABLE Tokoh
(
  Tokoh_ID INT NOT NULL AUTO_INCREMENT,
  Nama_Tokoh VARCHAR(255) NOT NULL,
  Tahun_Lahir INT,
  Tahun_Wafat INT,
  Biografi_Singkat TEXT NOT NULL,
  Kerajaan_ID INT,
  PRIMARY KEY (Tokoh_ID),
  FOREIGN KEY (Kerajaan_ID) REFERENCES Kerajaan(Kerajaan_ID)
);

CREATE TABLE Objek_Temuan
(
  Objek_ID INT NOT NULL AUTO_INCREMENT,
  Nama_Objek VARCHAR(255) NOT NULL,
  Jenis_Objek VARCHAR(255) NOT NULL,
  Bahan VARCHAR(255) NOT NULL,
  Panjang DECIMAL(5,2) NOT NULL,
  Tinggi DECIMAL(5,2) NOT NULL,
  Lebar DECIMAL(5,2) NOT NULL,
  Teks_Transliterasi TEXT,
  Aksara VARCHAR(255),
  Bahasa VARCHAR(255),
  Situs_ID INT NOT NULL,
  PRIMARY KEY (Objek_ID),
  FOREIGN KEY (Situs_ID) REFERENCES Situs_Arkeologi(Situs_ID)
);

CREATE TABLE Penelitian_Situs
(
  Arkeolog_ID INT NOT NULL,
  Situs_ID INT NOT NULL,
  PRIMARY KEY (Arkeolog_ID, Situs_ID),
  FOREIGN KEY (Arkeolog_ID) REFERENCES Arkeolog(Arkeolog_ID),
  FOREIGN KEY (Situs_ID) REFERENCES Situs_Arkeologi(Situs_ID)
);

CREATE TABLE Atribusi_Artefak
(
  Objek_ID INT NOT NULL,
  Tokoh_ID INT NOT NULL,
  PRIMARY KEY (Objek_ID, Tokoh_ID),
  FOREIGN KEY (Objek_ID) REFERENCES Objek_Temuan(Objek_ID),
  FOREIGN KEY (Tokoh_ID) REFERENCES Tokoh(Tokoh_ID)
);

CREATE TABLE Tokoh_Gelar_Tokoh
(
  Gelar_Tokoh VARCHAR(255) NOT NULL,
  Tokoh_ID INT NOT NULL,
  PRIMARY KEY (Gelar_Tokoh, Tokoh_ID),
  FOREIGN KEY (Tokoh_ID) REFERENCES Tokoh(Tokoh_ID)
);
